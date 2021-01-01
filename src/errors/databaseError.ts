import {ErrorResponse} from './helpers/errorResponse';

export const DATABASE_ERROR = error =>
  new ErrorResponse({
    errorCode: 'DATABASE_ERROR',
    message: error?.message || '',
    statusCode: 500,
  });
