import {ErrorResponse} from './helpers/errorResponse';

export const USER_NOT_FOUND = new ErrorResponse({
  errorCode: 'UserNotFound',
  message: 'User not found!',
  statusCode: 400,
});
