/**
 * To read more about graphql data structure @see https://www.apollographql.com/docs/apollo-server/data/data-sources/
 * Also deep dive of data structure @see https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/
 * */

// import DataLoader from 'dataloader'
import {DataSource} from 'apollo-datasource';
import {ApolloError, AuthenticationError} from 'apollo-server-core';
import {SendMailOptions} from 'nodemailer';
import {ulid} from 'ulid';

import {
  APP_NAME,
  LOGO_SRC,
  MAIL_USER,
  SERVER_DOMAIN,
} from '../../../config/environment';
import {
  CreateUserInput,
  ListUsersCollateInput,
  Maybe,
  ResetPasswordInput,
  UpdateUserInput,
  User,
} from '../../../graphql/models';
import {mailingQueue} from '../../../jobs/queues/mailing.queue';
import {
  decodeJwT,
  encodeJwT,
  getSaltAndHashedPassword,
  redisClient,
} from '../../../services';
import renderTemplate from '../../../services/renderTemplate.service';
import {callTryCatch, getUTCTime} from '../../../util';
import AuthorizationDbModel from '../_database/authorization.model';
import UserDbModel, {IUserModel} from '../_database/user.model';
import DuplicationError from '../_errors/DuplicationError.error';
import NotFoundError from '../_errors/NotFoundError.error';

const USER_IDENTIFIER_KEY = 'USER';

// const PLACES_INDEX = 'places:index'
// const CITIES_INDEX = 'cities:index'
// const STATES_INDEX = 'states:index'

// const LIMIT = 20000

class UserDataSource extends DataSource {
  constructor() {
    super();
    //   this.redis = redis
    //   this.loader = new DataLoader(
    //     requests => this.load(requests),
    //     { cacheKeyFn: JSON.stringify }
    //   )
    this.getUserById = this.getUserById.bind(this);
    this.checkUserVerificationId = this.checkUserVerificationId.bind(this);
    this.invalidateUserToken = this.invalidateUserToken.bind(this);
    this.throwAuthenticationError = this.throwAuthenticationError.bind(this);
    this.unknownError = this.unknownError.bind(this);
  }

  async getUserById(id: string) {
    const responseResult = await callTryCatch<IUserModel | null, Error>(
      async () =>
        UserDbModel.findOne({id}).select(['-password', '-passwordSalt'])
    );

    if (responseResult instanceof Error) this.unknownError(responseResult);

    if (!responseResult) {
      throw new ApolloError('User not found!');
    }

    return responseResult as unknown as User & {verificationId: string};
  }

  async listUsers(input?: Maybe<ListUsersCollateInput>) {
    // const page = value.page || 1;
    //   const perPage = value.perPage || 20;

    let pageNumber = 1;
    let pageSize = 50;
    let filterConfig: any;
    let sortConfig: any;

    if (input?.page) {
      if (!pageNumber || pageNumber < 1) pageNumber = 1;
      if (!pageSize || pageSize > 50) pageSize = 50;
    }

    if (input?.filter) {
      const filterJson = JSON.stringify(input.filter).replace(/_/g, '$');
      filterConfig = JSON.parse(filterJson);
    }

    if (input?.sort) {
      sortConfig = input.sort;
    }

    const responseResult = await callTryCatch<IUserModel[], Error>(async () =>
      UserDbModel.find(filterConfig)
        .sort(sortConfig)
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize * pageNumber)
        .select(['-password', '-passwordSalt'])
        .exec()
    );

    if (responseResult instanceof Error) {
      throw this.unknownError(responseResult);
    }

    return responseResult as User[];
  }

  async deleteUser(id: string) {
    const responseResult = await callTryCatch<IUserModel | null, Error>(
      async () =>
        UserDbModel.findByIdAndDelete(id).select([
          '-password',
          '-passwordSalt',
          '-attemptOfResetPassword',
          '-verificationId',
          '-status',
        ])
    );

    if (responseResult instanceof Error) this.unknownError(responseResult);

    if (!responseResult) {
      throw new ApolloError('User not found!');
    }

    return responseResult || {};
  }

  async createUser(input: CreateUserInput) {
    const userId = ulid();
    const authorizationId = ulid();

    const responseResult = await callTryCatch<IUserModel | null, Error>(
      async () => {
        const {password, passwordSalt} = getSaltAndHashedPassword(
          input.password
        );
        const newUser = await UserDbModel.create({
          ...input,
          id: userId,
          email: input.email.toLowerCase(),
          authorizationId,
          isSuper: false,
          isActive: false,
          verificationId: ulid(),
          password,
          passwordSalt,
          name: {
            first: input.firstName,
            last: input.lastName,
          },
          attemptOfResetPassword: 0,
        });

        const userAuthorization = await AuthorizationDbModel.create({
          id: authorizationId,
          userId,
          actions: [],
        });

        await userAuthorization.save();

        const user = await newUser.save();
        return user;
      }
    );

    if (responseResult instanceof Error) {
      if ((responseResult as any).code === 11000)
        throw new DuplicationError(responseResult.message);

      if (responseResult instanceof Error)
        throw this.unknownError(responseResult);
    }

    return responseResult as unknown as User & {verificationId: string};
  }

  async updateUser(input: UpdateUserInput & {lastSeenAt?: string}) {
    const responseResult = await callTryCatch<IUserModel | null, Error>(
      async () =>
        UserDbModel.findOneAndUpdate(
          {id: input.id},
          {
            ...input,
            name: {
              first: input.firstName,
              last: input.lastName,
            },
          },
          {new: true}
        )
    );

    if (responseResult instanceof Error)
      throw this.unknownError(responseResult);

    if (!responseResult) throw new NotFoundError('User not found!');

    // ! TODO: Create user has been updated successfully page
    // await mailingQueue.add(
    //   {
    //     html: `
    //       <h1>Your user has been updated successfully</h1>`,
    //     from: MAIL_USER,
    //     to: responseResult.email,
    //     subject: `${APP_NAME} - User has been updated!`,
    //   } as SendMailOptions,
    //   {
    //     jobId: ulid(),
    //     delay: 5000,
    //     attempts: 2,
    //   }
    // );

    return responseResult as User;
  }

  async resetUserPassword(input: ResetPasswordInput) {
    const result = decodeJwT<{email: string}>(input.hash);

    const {password, passwordSalt} = getSaltAndHashedPassword(
      input.newPassword
    );

    await UserDbModel.findOneAndUpdate(
      {email: result.data.email},
      {
        isActive: true,
        password,
        passwordSalt,
      },
      {new: true}
    );

    // TODO: if user exist, send an email to clarification.
    return {
      message: 'Done',
    };
  }

  async forgotUserPassword(email: string) {
    const responseResult = await UserDbModel.findOne({
      email,
    });

    if (responseResult instanceof Error)
      throw this.unknownError(responseResult);

    if (!responseResult) throw new NotFoundError('User not found!');

    await mailingQueue.add(
      {
        html: renderTemplate('views/forgot-your-password.hbs', {
          logoSrc: LOGO_SRC,
          baseUrl: SERVER_DOMAIN,
          hash: encodeJwT({email: responseResult.email}, {expiresIn: '5m'}),
        }),
        from: MAIL_USER,
        to: email,
        subject: `${APP_NAME} - Forgot Password!`,
      } as SendMailOptions,
      {
        jobId: ulid(),
        delay: 5000, // 1 min in ms
        attempts: 2,
      }
    );

    return {
      message:
        'If your email is registered, we sent you an email to reset your password.',
    };
  }

  // Required when we need to invalidate user token.
  async checkUserVerificationId(userId: string, verificationId: string) {
    const userResult = (await this.getUserById(userId)) as IUserModel & {
      verificationId: string;
    };
    if (userResult.verificationId !== verificationId)
      this.throwAuthenticationError();

    await this.updateUser({
      id: userId,
      lastSeenAt: getUTCTime(new Date()),
    });

    return userResult;
  }

  async invalidateUserToken(userId: string) {
    const userData = await this.getUserById(userId);
    await redisClient.set(
      `${USER_IDENTIFIER_KEY}:${userId}:${userData.verificationId}`,
      'access_forbidden',
      'EX',
      60 * 60 * 24 * 7 // Expire for 7 days till reset password attempt.
    );

    const responseResult = await callTryCatch<IUserModel | null, Error>(
      async () =>
        UserDbModel.findOneAndUpdate(
          {id: userId},
          {
            isActive: false,
          },
          {new: true}
        )
    );

    if (responseResult instanceof Error)
      throw this.unknownError(responseResult);

    if (!responseResult) throw new NotFoundError('User not found!');

    return {message: 'User token has been invalidate'};
  }

  // Errors
  throwAuthenticationError(responseResult?: any) {
    throw new AuthenticationError('Unauthenticated call', responseResult);
  }

  unknownError(responseResult?: any) {
    return new ApolloError(
      responseResult.message,
      'INTERNAL_SERVER_ERROR',
      responseResult
    );
  }
}

const userDataSource = new UserDataSource();
export {UserDataSource};
export default userDataSource;
