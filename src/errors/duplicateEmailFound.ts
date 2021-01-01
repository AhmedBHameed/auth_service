import {ErrorResponse} from './helpers/errorResponse';

export const DUPLICATE_EMAIL_FOUND = new ErrorResponse({
  errorCode: 'DuplicateEmailFound',
  message: 'Provided email is already exists.',
  statusCode: 400,
});
