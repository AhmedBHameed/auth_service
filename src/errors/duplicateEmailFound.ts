import {ErrorResponse} from './helpers/errorResponse';

export const DUPLICATE_EMAIL_FOUND = new ErrorResponse({
  errorCode: 'DUPLICATE_EMAIL_FOUND',
  message: 'Provided email is already exists.',
  statusCode: 400,
});
