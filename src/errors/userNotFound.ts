import {ErrorResponse} from './helpers/errorResponse';

export const USER_NOT_FOUND = new ErrorResponse({
  errorCode: 'USER_NOT_FOUND',
  message: 'User not found!',
  statusCode: 400,
});
