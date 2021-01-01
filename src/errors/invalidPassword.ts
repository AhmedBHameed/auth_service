import {ErrorResponse} from './helpers/errorResponse';

export const INVALID_PASSWORD = new ErrorResponse({
  errorCode: 'INVALID_PASSWORD',
  message: 'Invalid user password',
  statusCode: 400,
});
