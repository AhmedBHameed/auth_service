import Joi from 'joi';

/**
 * Joi optional string validation function.
 * @returns
 */
export const optionalString = () => Joi.string().allow('');
