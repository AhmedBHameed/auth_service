import {ErrorResponse} from './helpers/errorResponse';

export const USER_NOT_FOUND_OR_INACTIVE = new ErrorResponse({
  errorCode: 'USER_NOT_FOUND_OR_INACTIVE',
  message: 'User not found or inactive!',
  statusCode: 400,
});
