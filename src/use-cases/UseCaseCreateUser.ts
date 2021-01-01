import {injectable} from 'inversify';
import {omit} from 'lodash';
import UserModel, {IUserModel, UserStatus} from 'src/database/UserModel';

import Joi from '@hapi/joi';

import {PASSWORD_REGULAR_EXPRESSION} from './helper/passwordRegularExpression';
import {ValidationResultData} from './helper/ValidationResultData';
import {DATABASE_ERROR, DUPLICATE_EMAIL_FOUND, ErrorResponse, VALIDATION_ERROR} from 'src/errors';

export interface CreateUserInput {
  email: string;
  password: string;
  verificationId?: string;
  avatar?: string;
  name?: {
    first: string;
    last: string;
  };
  appName: string;
}

type CreateUserDataSchema = CreateUserInput & {passwordSalt: string};

const createUserValidationSchema = Joi.object<CreateUserDataSchema>({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PASSWORD_REGULAR_EXPRESSION).required().messages({
    'string.required': 'Password field is required.',
    'string.pattern.base': `Your password must have at least: • 8 characters long Password • 1 uppercase and 1 lowercase character • 1 number • 1 non-alpha-numeric character • with no space`,
  }),
  avatar: Joi.string().optional(),
  verificationId: Joi.string().optional(),
  name: Joi.object({
    first: Joi.string().optional(),
    last: Joi.string().optional(),
  }).optional(),
  appName: Joi.string().optional(),
});

@injectable()
class UseCaseCreateUser {
  public validate(data: CreateUserInput): ValidationResultData<CreateUserDataSchema> {
    return createUserValidationSchema.validate(data, {abortEarly: false});
  }

  public async run(
    data: ValidationResultData<CreateUserDataSchema>
  ): Promise<(IUserModel & {role: string}) | null | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) return VALIDATION_ERROR(error);
      value.email = value.email.toLowerCase();

      const newUserAccount = await UserModel.create({
        ...value,
        status: UserStatus.INACTIVE,
        roles: [`${value.appName}_USER`],
        attemptOfResetPassword: 0,
      });

      const createdUserAccount = await newUserAccount.save();
      return {...(omit(createdUserAccount?.toObject(), ['roles']) as any), role: 'USER'};
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        return DUPLICATE_EMAIL_FOUND;
      }

      return DATABASE_ERROR(error);
    }
  }
}

export default UseCaseCreateUser;
