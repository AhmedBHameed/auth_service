import {injectable} from 'inversify';
import UserModel, {IUserModel, UserStatus} from 'src/database/UserModel';
import {ulid} from 'ulid';

import Joi from '@hapi/joi';

import {PASSWORD_REGULAR_EXPRESSION} from './helper/passwordRegularExpression';
import {ValidationResultData} from './helper/ValidationResultData';
import {ErrorResponse, VALIDATION_ERROR, RESET_PASSWORD_BAD_ARGUMENT, USER_NOT_FOUND, DATABASE_ERROR} from 'src/errors';

export interface ResetUserPasswordInput {
  userId: string;
  verificationId: string;
  password: string;
}

type ResetUserPasswordWithPasswordSalt = ResetUserPasswordInput & {passwordSalt: string};

const changePasswordValidationSchema = Joi.object<ResetUserPasswordWithPasswordSalt>({
  userId: Joi.string().required(),
  verificationId: Joi.string().required(),
  password: Joi.string()
    .pattern(
      PASSWORD_REGULAR_EXPRESSION,
      'password should be at least 8 characters long, max length of 255 characters - 1 capital letter - 1 small letter - 1 special character => !@#$%^&* of'
    )
    .required(),
  passwordSalt: Joi.string().optional(),
});

@injectable()
class UseCaseResetPassword {
  public validate = (data: ResetUserPasswordInput): Joi.ValidationResult => {
    return changePasswordValidationSchema.validate(data, {abortEarly: false});
  };

  public async run(data: ValidationResultData<ResetUserPasswordWithPasswordSalt>): Promise<IUserModel | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) return VALIDATION_ERROR(error);

      const userWithChangedPassword = await UserModel.findOneAndUpdate(
        {
          _id: value.userId,
          verificationId: value.verificationId,
        },
        {
          verificationId: ulid(),
          password: value.password,
          passwordSalt: value.passwordSalt,
          status: UserStatus.ACTIVE,
        },
        {new: true}
      );

      if (!userWithChangedPassword) return USER_NOT_FOUND;

      return userWithChangedPassword;
    } catch (error) {
      if (error.name === 'CastError') return RESET_PASSWORD_BAD_ARGUMENT(error);
      return DATABASE_ERROR(error);
    }
  }
}

export default UseCaseResetPassword;
