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
import {ulid} from 'ulid';

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from '../../../config/environment';
import {
  AuthInput,
  AuthorizationInput,
  Context,
  Maybe,
  UserAction,
} from '../../../graphql/models';
import {GithubUserDataModel} from '../../../graphql/models/GithubUserDataModel';
import {
  createToken,
  decodeJwT,
  getSaltAndHashedPassword,
  JsonWebTokenError,
  JWTPayload,
  redisClient,
  TokenExpiredError,
  verifiedPassword,
} from '../../../services';
import {httpClient} from '../../../services/httpClient';
import {logger} from '../../../services/logger.service';
import {callTryCatch} from '../../../util';
import AuthorizationDbModel, {
  IAuthorizationModel,
} from '../_database/authorization.model';
import UserDbModel, {IUserModel} from '../_database/user.model';

const USER_IDENTIFIER_KEY = 'USER';

class AuthDataSource extends DataSource<Context> {
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
    this.upsertAuthorization = this.upsertAuthorization.bind(this);
    this.unknownError = this.unknownError.bind(this);
    this.forbiddenError = this.forbiddenError.bind(this);
  }

  /**
   * ####################### Authentication methods #######################
   */
  async createTokens(input: AuthInput, rememberMe: Maybe<boolean> = true) {
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
      | (Omit<IAuthorizationModel, 'userActionsAsJson'> & {
          actions?: UserAction[];
        })
      | null,
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

    const tokens = createToken(
      {
        id: userAccount.id,
        isActive: !!userAccount.isActive,
        isSuper: !!userAccount.isSuper,
        verificationId: userAccount.verificationId || '',
      },
      rememberMe
    );

    return tokens;
  }

  private async _verifyToken(token: string): Promise<JWTPayload> {
    const verificationResult = await callTryCatch<
      JWTPayload | null,
      TokenExpiredError | JsonWebTokenError
    >(async () => decodeJwT<JWTPayload>(token).data);

    if (verificationResult instanceof TokenExpiredError)
      throw new AuthenticationError('Unauthorized token! Token expired.');

    if (verificationResult instanceof JsonWebTokenError)
      throw new AuthenticationError(
        'Unauthorized token! Invalid or empty tokens.'
      );

    if (!verificationResult) throw new AuthenticationError('Invalid token!');

    const {id, verificationId} = verificationResult;
    const isForbiddenUser = await this.isForbiddenUserAccess(
      id,
      verificationId
    );

    if (isForbiddenUser) throw this.forbiddenError();

    return verificationResult;
  }

  public async verifyAccessToken(token: string): Promise<JWTPayload> {
    const payloadResult = await this._verifyToken(token);
    if (payloadResult.isRefreshToken) {
      throw new AuthenticationError(
        'Please use access token. Received refresh token instead.'
      );
    }
    return payloadResult;
  }

  public async verifyRefreshToken(token: string): Promise<JWTPayload> {
    const payloadResult = await this._verifyToken(token);
    if (!payloadResult.isRefreshToken) {
      throw new AuthenticationError(
        'Please use refresh token. Received access token instead.'
      );
    }
    return payloadResult;
  }

  async refreshTokens(refreshToken: string) {
    const verificationResult = await this.verifyRefreshToken(refreshToken);

    const tokenPayload = verificationResult;
    const tokens = createToken(tokenPayload, true);

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
    const userAuthorization = await this.getUserAuthorization(tokenPayload.id);

    const userPermissions =
      userAuthorization.actions.find(
        (action) => action?.name === requiredAction.modelName
      )?.permissions || [];

    const requiredPermission = userPermissions.find((permission) =>
      permission?.includes(requiredAction.permission)
    );

    const isOwn = requiredPermission?.split(':')[1] === 'own';

    if (isOwn) {
      //  You can read only your own data.
      if (tokenPayload.id !== ownedById)
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
    >(async () => AuthorizationDbModel.findOne({userId: userId || ''}));
    if (responseResult instanceof Error)
      throw this.unknownError(responseResult);

    if (!responseResult) {
      throw new ForbiddenError(`Your don't have authorization!`);
    }

    return responseResult;
  }

  async upsertAuthorization(input: AuthorizationInput) {
    const responseResult = await callTryCatch<IAuthorizationModel, Error>(
      async () => {
        const newUserAuthorization =
          await AuthorizationDbModel.findOneAndUpdate(
            {userId: input.userId || ''},
            {
              id: ulid(),
              userId: input.userId || undefined,
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

  // ####################### Github OAuth methods #######################

  async createGithubTokens(githubCode: string) {
    const endpoint = 'https://github.com/login/oauth/access_token';

    const result = await httpClient.post(
      endpoint,
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: githubCode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (result.data.error)
      throw new AuthenticationError(result.data.error_description);

    /**
       * ERROR: {
            error: 'bad_verification_code',
            error_description: 'The code passed is incorrect or expired.',
            error_uri: 'https://docs.github.com/apps/managing-oauth-apps/troubleshooting-oauth-app-access-token-request-errors/#bad-verification-code'
          }

          SUCCESS:

          {
             access_token: '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',
             token_type: 'bearer',
             scope: 'user'
          }


       */
    return result.data.access_token;
  }

  async verifyGithubAccessToken(githubToken: string) {
    const endpoint = `https://api.github.com/user`;

    try {
      const result = await httpClient.post(endpoint, undefined, {
        headers: {
          Authorization: `bearer ${githubToken}`,
        },
      });

      return result.data as GithubUserDataModel;
    } catch (error) {
      throw new AuthenticationError((error as any).response?.data?.message);
    }
  }

  async createSocialMediaToken(githubUserData: GithubUserDataModel) {
    let user: IUserModel | null | Error;

    user = await UserDbModel.findOne({socialMediaId: githubUserData.id});

    if (!user) {
      const userId = ulid();
      const authorizationId = ulid();
      const {password, passwordSalt} = getSaltAndHashedPassword(ulid());

      user = await callTryCatch<IUserModel | null, Error>(async () =>
        UserDbModel.findOneAndUpdate(
          {socialMediaId: githubUserData.id},
          {
            id: userId,
            socialMediaId: githubUserData.id,
            email: githubUserData.email,
            name: {
              first: githubUserData.name,
            },
            password,
            passwordSalt,
            authorizationId,
            avatar: githubUserData.avatar_url,
            isActive: true,
            isSuper: false,
            verificationId: ulid(),
            about: githubUserData.bio,
            githubUrl: githubUserData.html_url,
            address: {
              state: githubUserData.location,
            },
          },
          {upsert: true, new: true}
        )
      );
      if (user instanceof Error) {
        logger.error(user);
        throw new AuthenticationError('Database error!');
      }

      if (!user) {
        throw new ApolloError('User not found!');
      }

      const userAuthorization = await AuthorizationDbModel.create({
        id: authorizationId,
        userId,
        actions: [],
      });

      await userAuthorization.save();
    }

    const userAccount = user as IUserModel & {
      password: string;
      verificationId: string;
    };

    const tokens = createToken(
      {
        id: userAccount.id,
        isActive: !!userAccount.isActive,
        isSuper: !!userAccount.isSuper,
        verificationId: userAccount.verificationId || '',
      },
      true
    );

    return tokens;
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

const authDataSource = new AuthDataSource();
export {AuthDataSource};
export default authDataSource;
