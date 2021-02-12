import {ErrorResponse} from './helpers/errorResponse';

export const RESET_ATTEMPTS_EXCEEDED = new ErrorResponse({
  errorCode: 'RESET_ATTEMPTS_EXCEEDED',
  message: 'Reset attempts exceeded. Try again after 30 minutes',
  statusCode: 422,
});
