/**
 * To read more about graphql data structure @see https://www.apollographql.com/docs/apollo-server/data/data-sources/
 * Also deep dive of data structure @see https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/
 * */

// import DataLoader from 'dataloader'
import {DataSource} from 'apollo-datasource';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server-core';
import {
  AuthInput,
  AuthorizationInput,
  Context,
  Maybe,
  UserAction,
} from 'src/graphql/models';
import {
  createToken,
  JsonWebTokenError,
  ParseTokenData,
  redisClient,
  TokenExpiredError,
  verifiedPassword,
  verifyToken,
} from 'src/services';
import {logger} from 'src/services/logger.service';
import {callTryCatch} from 'src/util';
import {ulid} from 'ulid';

import AuthorizationDbModel, {
  IAuthorizationModel,
} from '../_database/authorization.model';
import UserDbModel, {IUserModel} from '../_database/user.model';

const USER_IDENTIFIER_KEY = 'USER';

export default class AuthDataSource extends DataSource<Context> {
  constructor() {
    super();
    this.createTokens = this.createTokens.bind(this);
    this._verifyToken = this._verifyToken.bind(this);
    this.verifyAccessToken = this.verifyAccessToken.bind(this);
    this.verifyRefreshToken = this.verifyRefreshToken.bind(this);
    this.refreshTokens = this.refreshTokens.bind(this);
    this.isForbiddenUserAccess = this.isForbiddenUserAccess.bind(this);
    this.isAuthorizedUser = this.isAuthorizedUser.bind(this);
    this.getUserAuthorization = this.getUserAuthorization.bind(this);
    this.updateAuthorization = this.updateAuthorization.bind(this);
    this.unknownError = this.unknownError.bind(this);
    this.forbiddenError = this.forbiddenError.bind(this);
  }

  /**
   * ####################### Authentication methods #######################
   */
  async createTokens(input: AuthInput) {
    const responseResult = await callTryCatch<IUserModel | null, Error>(
      async () =>
        UserDbModel.findOne({
          email: input.email,
          isActive: true,
        })
    );

    if (responseResult instanceof Error) {
      logger.error(responseResult);
      throw new AuthenticationError('Database error!');
    }

    if (!responseResult) {
      throw new ApolloError('User not found!');
    }

    const userAccount = responseResult as IUserModel & {
      password: string;
      verificationId: string;
    };

    const isValidPassword = verifiedPassword(
      input.password || '',
      userAccount.password || ''
    );

    if (!isValidPassword) {
      throw new AuthenticationError('Invalid email or password!');
    }

    const authorizationResult = await callTryCatch<
      IAuthorizationModel | null,
      Error
    >(async () =>
      AuthorizationDbModel.findOne({
        userId: userAccount.id,
      }).select('actions')
    );

    if (authorizationResult instanceof Error) {
      logger.error(authorizationResult);
      throw new AuthenticationError('Database error!', authorizationResult);
    }

    const actions = ((authorizationResult?.actions || []) as UserAction[]).map(
      (action) => ({name: action.name, permissions: action.permissions})
    );

    const tokens = createToken({
      id: userAccount.id,
      isActive: !!userAccount.isActive,
      isSuper: !!userAccount.isSuper,
      actions,
      verificationId: userAccount.verificationId || '',
    });

    return tokens;
  }

  private async _verifyToken(token: string): Promise<ParseTokenData> {
    const verificationResult = await callTryCatch<
      ParseTokenData | null,
      TokenExpiredError | JsonWebTokenError
    >(async () => verifyToken(token));

    if (verificationResult instanceof TokenExpiredError)
      throw new AuthenticationError('Unauthorized token! Token expired.');

    if (verificationResult instanceof JsonWebTokenError)
      throw new AuthenticationError(
        'Unauthorized token! Invalid or empty tokens.'
      );

    if (!verificationResult) throw new AuthenticationError('Invalid token!');

    const {id, verificationId} = verificationResult.data;
    const isForbiddenUser = await this.isForbiddenUserAccess(
      id,
      verificationId
    );

    if (isForbiddenUser) throw this.forbiddenError();

    return verificationResult;
  }

  public async verifyAccessToken(token: string): Promise<ParseTokenData> {
    const payloadResult = await this._verifyToken(token);
    if (payloadResult.data.isRefreshToken) {
      throw new AuthenticationError(
        'Please use access token. Received refresh token instead.'
      );
    }
    return payloadResult;
  }

  public async verifyRefreshToken(token: string): Promise<ParseTokenData> {
    const payloadResult = await this._verifyToken(token);
    if (!payloadResult.data.isRefreshToken) {
      throw new AuthenticationError(
        'Please use refresh token. Received access token instead.'
      );
    }
    return payloadResult;
  }

  async refreshTokens(refreshToken: string) {
    const verificationResult = await this.verifyRefreshToken(refreshToken);

    const tokenPayload = verificationResult.data;
    const tokens = createToken(tokenPayload);

    return {payload: tokenPayload, tokens};
  }

  async isForbiddenUserAccess(userId: string, verificationId: string) {
    const hasForbiddenAccess = await redisClient.get(
      `${USER_IDENTIFIER_KEY}:${userId}:${verificationId}`
    );

    return !!hasForbiddenAccess;
  }

  /**
   * ####################### Authorizations methods #######################
   */
  async isAuthorizedUser(
    accessToken: string,
    requiredAction: {modelName: string; permission: string},
    ownedById?: string
  ) {
    const tokenPayload = await this.verifyAccessToken(accessToken || '');

    const userPermissions =
      tokenPayload.data.actions.find(
        (action) => action.name === requiredAction.modelName
      )?.permissions || [];

    const requiredPermission = userPermissions.find((permission) =>
      permission?.includes(requiredAction.permission)
    );

    const isOwn = requiredPermission?.split(':')[1] === 'own';

    if (isOwn) {
      //  You can read only your own data.
      if (tokenPayload.data.id !== ownedById)
        throw new ForbiddenError(`Permission denied!`);

      return true;
    }

    if (requiredPermission !== `${requiredAction.permission}:any`)
      throw new ForbiddenError(`Permission denied!`);

    return true;
  }

  async getUserAuthorization(userId: Maybe<string>) {
    const responseResult = await callTryCatch<
      IAuthorizationModel | null,
      Error
    >(async () => AuthorizationDbModel.findOne({userId}));

    if (responseResult instanceof Error)
      throw this.unknownError(responseResult);

    if (!responseResult) {
      throw new ForbiddenError(`You don't have authorization!`);
    }

    return responseResult;
  }

  async updateAuthorization(input: AuthorizationInput) {
    const responseResult = await callTryCatch<IAuthorizationModel, Error>(
      async () => {
        const newUserAuthorization =
          await AuthorizationDbModel.findOneAndUpdate(
            {userId: input.userId},
            {
              id: ulid(),
              userId: input.userId,
              actions: input.actions,
            },
            {upsert: true, new: true}
          );

        const userAuthorization = await newUserAuthorization.save();
        return userAuthorization;
      }
    );

    if (responseResult instanceof Error)
      throw this.unknownError(responseResult);

    return responseResult;
  }

  unknownError(responseResult?: any) {
    return new ApolloError(
      responseResult.message,
      'INTERNAL_SERVER_ERROR',
      responseResult
    );
  }

  forbiddenError() {
    return new ForbiddenError('Access denied!');
  }
}
