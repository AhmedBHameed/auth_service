import {ErrorResponse} from './helpers/errorResponse';

export const USER_NOT_FOUND_OR_RESET_DATE_EXPIRED = new ErrorResponse({
  errorCode: 'USER_NOT_FOUND_OR_RESET_DATE_EXPIRED',
  message: 'User not found or reset date expired!',
  statusCode: 400,
});
