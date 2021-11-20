import Joi from 'joi';

interface ArrayErrorMessages {
  required?: string;
}

/**
 * Joi email validation function.
 * To customize error messages, pass an object of type EmailErrorMessages; otherwise, default messages activated.
 * {
 *    required?: string;
 * }
 *
 * @param conf type of EmailErrorMessages
 * @returns
 */
export const requiredArray = (conf?: ArrayErrorMessages) =>
  Joi.array()
    .items(Joi.any())
    .required()
    .messages({
      'any.required': conf?.required || 'validationError.required',
    });
