/**
 * To read more about graphql data structure @see https://www.apollographql.com/docs/apollo-server/data/data-sources/
 * Also deep dive of data structure @see https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/
 * */

// import DataLoader from 'dataloader'
import {DataSource} from 'apollo-datasource';
import {ApolloError, AuthenticationError} from 'apollo-server-core';
import {
  CreateUserInput,
  ListUsersCollateInput,
  Maybe,
  ResetPasswordInput,
  UpdateUserInput,
} from 'src/graphql/models';
import {getSaltAndHashedPassword, redisClient} from 'src/services';
import {callTryCatch} from 'src/util';
import {ulid} from 'ulid';

import UserDbModel, {IUserModel} from '../_database/user.model';
import DuplicationError from '../_errors/DuplicationError.error';
import NotFoundError from '../_errors/NotFoundError.error';

const USER_IDENTIFIER_KEY = 'USER';

// const PLACES_INDEX = 'places:index'
// const CITIES_INDEX = 'cities:index'
// const STATES_INDEX = 'states:index'

// const LIMIT = 20000

export default class UserDataSource extends DataSource {
  constructor() {
    super();
    //   this.redis = redis
    //   this.loader = new DataLoader(
    //     requests => this.load(requests),
    //     { cacheKeyFn: JSON.stringify }
    //   )
    this.getUserById = this.getUserById.bind(this);
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

    return responseResult as IUserModel & {verificationId: string};
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

    return responseResult;
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
    const responseResult = await callTryCatch<IUserModel | null, Error>(
      async () => {
        const {password, passwordSalt} = getSaltAndHashedPassword(
          input.password
        );
        const newUser = await UserDbModel.create({
          ...input,
          id: ulid(),
          email: input.email.toLowerCase(),
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

    return responseResult as IUserModel & {verificationId: string};
  }

  async updateUser(input: UpdateUserInput) {
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

    return responseResult || {};
  }

  async resetUserPassword(input: ResetPasswordInput) {
    const {password, passwordSalt} = getSaltAndHashedPassword(
      input.newPassword
    );
    await UserDbModel.findOneAndUpdate(
      {
        verificationId: input.verificationId,
        id: input.userId,
      },
      {
        isActive: true,
        verificationId: ulid(),
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

  // Required when we need to invalidate user token.
  async checkUserVerificationId(userId: string, verificationId: string) {
    const userResult = (await this.getUserById(userId)) as IUserModel & {
      verificationId: string;
    };
    if (userResult.verificationId !== verificationId)
      this.throwAuthenticationError();
  }

  async invalidateUserToken(userId: string) {
    const userData = await this.getUserById(userId);
    await redisClient.set(
      `${USER_IDENTIFIER_KEY}:${userId}:${userData.verificationId}`,
      'access_forbidden',
      'ex',
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
