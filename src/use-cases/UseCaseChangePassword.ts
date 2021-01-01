import {injectable} from 'inversify';
import UserModel, {UserStatus} from 'src/database/UserModel';

import Joi from '@hapi/joi';

import {PASSWORD_REGULAR_EXPRESSION} from './helper/passwordRegularExpression';
import {ValidationResultData} from './helper/ValidationResultData';
import {utcTime} from 'src/util/time';
import {ErrorResponse, USER_NOT_FOUND_OR_RESET_DATE_EXPIRED, VALIDATION_ERROR} from 'src/errors';

// TODO: Simulate old password matching before change password.
export interface ChangeUserPasswordData {
  password: string;
  passwordSalt?: string;
  verificationId: string;
}

type ChangePassUserDataSchema = ChangeUserPasswordData;

const changePasswordValidationSchema = Joi.object<ChangePassUserDataSchema>({
  password: Joi.string()
    .pattern(
      PASSWORD_REGULAR_EXPRESSION,
      'password should be at least 8 characters long, max length of 255 characters - 1 capital letter - 1 small letter - 1 special character => !@#$%^&* of'
    )
    .required(),
  verificationId: Joi.string().required(),
});

@injectable()
class UseCaseChangePassword {
  public validate = (data: ChangePassUserDataSchema): Joi.ValidationResult => {
    return changePasswordValidationSchema.validate(data, {abortEarly: false});
  };

  public async run(data: ValidationResultData<ChangePassUserDataSchema>): Promise<{message: string} | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) return VALIDATION_ERROR(error);

      const userWithChangedPassword = await UserModel.findOneAndUpdate(
        {
          verificationId: value.verificationId,
          updatedAt: {$gte: utcTime().subtract(1, 'day').toDate()},
        },
        {
          password: value.password,
          passwordSalt: value.passwordSalt,
          status: UserStatus.ACTIVE,
        },
        {new: true}
      );

      if (!userWithChangedPassword) return USER_NOT_FOUND_OR_RESET_DATE_EXPIRED;

      return {message: 'Password has been changed successfully'};
    } catch (error) {
      return error;
    }
  }
}

export default UseCaseChangePassword;
