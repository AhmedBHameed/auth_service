import {ApolloError} from 'apollo-server-core';

export class DuplicationError extends ApolloError {
  constructor(message: string) {
    super(message, 'DUPLICATION_ERROR');

    Object.defineProperty(this, 'name', {value: 'DuplicationError'});
  }
}

export default DuplicationError;
