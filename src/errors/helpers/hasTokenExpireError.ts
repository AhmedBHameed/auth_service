import {TokenExpiredError} from 'jsonwebtoken';
import {ErrorResponse} from './errorResponse';

/**
 * Error return as follow:
 *
 * errorCode: 'TokenExpiredError',
 * message: 'Token is expired',
 * statusCode: 400,
 */
export const hasTokenExpireError = (error: TokenExpiredError | Error): ErrorResponse | undefined => {
  if (error instanceof TokenExpiredError) {
    return new ErrorResponse({
      errorCode: 'TokenExpiredError',
      message: 'Token is expired',
      statusCode: 400,
    });
  }
  return undefined;
};
