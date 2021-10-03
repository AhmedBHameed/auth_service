/**
 * To read more about graphql data structure @see https://www.apollographql.com/docs/apollo-server/data/data-sources/
 * Also deep dive of data structure @see https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/
 * */

// import DataLoader from 'dataloader'
import {DataSource} from 'apollo-datasource';
import {ApolloError, AuthenticationError} from 'apollo-server-core';
import {AuthInput, Context, UserAction} from 'src/graphql/models';
import {
  createToken,
  JsonWebTokenError,
  ParseTokenData,
  TokenExpiredError,
  verifiedPassword,
  verifyToken,
} from 'src/services';
import {logger} from 'src/services/logger.service';
import {callTryCatch} from 'src/util';

import AuthorizationDbModel, {
  IAuthorizationModel,
} from '../_database/authorization.model';
import UserDbModel, {IUserModel} from '../_database/user.model';

export default class AuthDataSource extends DataSource<Context> {
  constructor() {
    super();
    this.createTokens = this.createTokens.bind(this);
    this._verifyToken = this._verifyToken.bind(this);
    this.verifyAccessToken = this.verifyAccessToken.bind(this);
    this.verifyRefreshToken = this.verifyRefreshToken.bind(this);
    this.refreshTokens = this.refreshTokens.bind(this);
  }

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
      throw new AuthenticationError('Database error!', responseResult);
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
      throw new AuthenticationError(
        'Invalid email or password!',
        responseResult
      );
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
}
