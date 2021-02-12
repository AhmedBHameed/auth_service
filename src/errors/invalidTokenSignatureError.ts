import {ErrorResponse} from './helpers/errorResponse';

/**
 * Error return as follow:
 *
 * errorCode: 'InvalidTokenSignature',
 * message: 'Invalid token signature',
 * statusCode: 400,
 */
export const INVALID_TOKEN_SIGNATURE = new ErrorResponse({
  errorCode: 'INVALID_TOKEN_SIGNATURE',
  message: 'Invalid token signature',
  statusCode: 400,
});
