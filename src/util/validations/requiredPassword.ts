import Joi from 'joi';

/**
 * Joi password validation function.
 * To customize error messages, pass an object of type PasswordErrorMessages; otherwise, default messages activated.
 * {
 *    required?: string;
 *    invalidPassword?: string;
 * }
 *
 * @param conf type of PasswordErrorMessages
 * @returns
 */
export const passwordValidator = Joi.string()
  .pattern(
    /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,255}$/
  )
  .messages({
    'string.pattern.base':
      'Invalid password. Password must have at least: • 8 characters long Password • 1 uppercase and 1 lowercase character • 1 number • 1 non-alpha-numeric character • with no space',
  });
