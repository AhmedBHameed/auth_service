import Joi from 'joi';

interface StringErrorMessages {
  required?: string;
}

/**
 * Joi required string validation function.
 * To customize error messages, pass an object of type EmailErrorMessages; otherwise, default messages activated.
 * {
 *    required?: string;
 * }
 *
 * @param conf type of EmailErrorMessages
 * @returns
 */
export const requiredNumber = (conf?: StringErrorMessages) =>
  Joi.number()
    .required()
    .messages({
      'any.required': conf?.required || 'validationError.required',
      'number.base': conf?.required || 'validationError.required',
    });
