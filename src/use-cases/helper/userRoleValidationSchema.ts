import Joi from '@hapi/joi';

const userRoleValidationSchema = Joi.object().keys({
  appName: Joi.string().required(),
  isBackofficeOfficer: Joi.boolean().required(),
  isPublisherOfficer: Joi.boolean().required(),
});

export default userRoleValidationSchema;
