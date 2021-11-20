import Joi from 'joi';

/**
 * Joi email validation function.
 */
const requiredEmailValidator = Joi.string()
  .email({tlds: {allow: false}}) // Disable top level domain of email to prevent error validation.
  .required();

export default requiredEmailValidator;
