import {ApolloError} from 'apollo-server-core';

export class InvalidRefreshTokenError extends ApolloError {
  constructor(message: string) {
    super(message, 'INVALID_REFRESH_TOKEN_ERROR');

    Object.defineProperty(this, 'name', {value: 'InvalidRefreshTokenError'});
  }
}

export default InvalidRefreshTokenError;
