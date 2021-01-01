import {ErrorResponse} from './helpers/errorResponse';

export const RESET_PASSWORD_BAD_ARGUMENT = (error): ErrorResponse =>
  new ErrorResponse({
    errorCode: 'RESET_PASSWORD_BAD_ARGUMENT',
    message: error.message,
    statusCode: 400,
  });
