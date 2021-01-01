import {injectable} from 'inversify';
import UserModel from 'src/database/UserModel';
import {getPassedTimeFrom} from 'src/util/time';
import {ulid} from 'ulid';

import Joi from '@hapi/joi';

import {ValidationResultData} from './helper/ValidationResultData';
import {DATABASE_ERROR, ErrorResponse, VALIDATION_ERROR} from 'src/errors';
import {USER_NOT_FOUND} from 'src/errors/userNotFound';
import {RESET_ATTEMPTS_EXCEEDED} from 'src/errors/resetAttemptsExceeded';

interface MongoModificationModel {
  n: number;
  nModified: number;
  ok: number;
}

export interface ForgotPasswordUserInput {
  email: string;
}

type ForgotPasswordUserDataSchema = ForgotPasswordUserInput;

const forgetUserPassValidationSchema = Joi.object<ForgotPasswordUserDataSchema>({
  email: Joi.string().email().required(),
});

@injectable()
class UseCaseForgotUserPassword {
  public validate = (data: ForgotPasswordUserDataSchema): Joi.ValidationResult => {
    return forgetUserPassValidationSchema.validate(data, {abortEarly: false});
  };

  public async run(
    data: ValidationResultData<ForgotPasswordUserInput>
  ): Promise<MongoModificationModel | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) VALIDATION_ERROR(error);

      const allowedUser = await UserModel.findOne({email: value.email});
      if (!allowedUser) return USER_NOT_FOUND;

      let attemptCount = allowedUser.attemptOfResetPassword;
      if (getPassedTimeFrom(allowedUser.get('updatedAt')) > 30) {
        attemptCount = 0;
      }
      if (attemptCount > 2) return RESET_ATTEMPTS_EXCEEDED;

      const resultOrError: MongoModificationModel = await UserModel.updateOne(
        {email: value.email},
        {
          verificationId: ulid(),
          attemptOfResetPassword: ++attemptCount,
        },
        {new: true}
      );

      return resultOrError;
    } catch (error) {
      return DATABASE_ERROR(error);
    }
  }
}

export default UseCaseForgotUserPassword;
