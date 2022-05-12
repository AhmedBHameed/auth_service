import Joi from 'joi';

/**
 * Joi required string validation function.
 */
const requiredStringValidator = Joi.string().required();

export default requiredStringValidator;
