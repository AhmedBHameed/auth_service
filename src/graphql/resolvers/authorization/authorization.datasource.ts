/**
 * To read more about graphql data structure @see https://www.apollographql.com/docs/apollo-server/data/data-sources/
 * Also deep dive of data structure @see https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/
 * */

// import DataLoader from 'dataloader'
import {DataSource} from 'apollo-datasource';
import {ApolloError, ForbiddenError} from 'apollo-server-core';
import {Maybe} from 'graphql/jsutils/Maybe';
import {AuthorizationInput, Context} from 'src/graphql/models';
import {JWTPayload} from 'src/services';
import {callTryCatch} from 'src/util';
import {ulid} from 'ulid';

import AuthorizationDbModel, {
  IAuthorizationModel,
} from '../_database/authorization.model';

export default class AuthorizationDataSource extends DataSource<Context> {
  constructor() {
    super();

    this.getUserAuthorization = this.getUserAuthorization.bind(this);
    this.unknownError = this.unknownError.bind(this);
  }

  async isAuthorizedUser(
    requiredAction: {modelName: string; permission: string},
    tokenPayload: JWTPayload,
    ownedId?: string
  ) {
    const userPermissions =
      tokenPayload.actions.find(
        (action) => action.name === requiredAction.modelName
      )?.permissions || [];

    const requiredPermission = userPermissions.find((permission) =>
      permission?.includes(requiredAction.permission)
    );

    const isOwn = requiredPermission?.split(':')[1] === 'own';

    if (isOwn) {
      //  You can read only your own data.
      if (tokenPayload.id !== ownedId)
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
}
