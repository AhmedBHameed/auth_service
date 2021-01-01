import {ErrorResponse} from './helpers/errorResponse';

export const NO_AUTHORIZATION_FOUND = new ErrorResponse({
  errorCode: 'NO_AUTHORIZATION_FOUND',
  message: 'User account exists but not authorized. Please contact your support team',
  statusCode: 400,
});
