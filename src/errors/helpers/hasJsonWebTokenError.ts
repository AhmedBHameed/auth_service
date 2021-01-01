import {JsonWebTokenError} from 'jsonwebtoken';
import {ErrorResponse} from './errorResponse';

/**
 * Error return as follow:
 *
 * errorCode: 'JsonWebTokenError',
 * message: 'Invalid token or empty',
 * statusCode: 400,
 */
export const hasJsonWebTokenError = (error: JsonWebTokenError | Error): ErrorResponse | undefined => {
  if (error instanceof JsonWebTokenError) {
    return new ErrorResponse({
      errorCode: 'JsonWebTokenError',
      message: 'Invalid access token or empty',
      statusCode: 400,
    });
  }
  return undefined;
};
