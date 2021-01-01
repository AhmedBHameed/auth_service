import {injectable} from 'inversify';
import UserModel, {IUserModel, UserStatus} from 'src/database/UserModel';
import {ulid} from 'ulid';

import Joi from '@hapi/joi';

import {ValidationResultData} from './helper/ValidationResultData';
import {ErrorResponse, VALIDATION_ERROR} from 'src/errors';
import {USER_NOT_FOUND_OR_INACTIVE} from 'src/errors/userNotFoundOrInactive';

export interface VerifyUserInput {
  verificationId: string;
  userId: string;
}

type VerifyUserDataSchema = VerifyUserInput;

const verifyUserValidationSchema = Joi.object<VerifyUserDataSchema>({
  verificationId: Joi.string().required(),
  userId: Joi.string().required(),
});

@injectable()
class UseCaseVerifyUser {
  public validate = (data: VerifyUserDataSchema): Joi.ValidationResult => {
    return verifyUserValidationSchema.validate(data, {abortEarly: false});
  };

  public async run(data: ValidationResultData<VerifyUserDataSchema>): Promise<IUserModel | null | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) return VALIDATION_ERROR(error);

      const verifiedUser = await UserModel.findOneAndUpdate(
        {verificationId: value.verificationId, _id: value.userId},
        {
          status: UserStatus.ACTIVE,
          verificationId: ulid(),
        },
        {new: true}
      ).select(['email', 'status']);

      if (!verifiedUser) return USER_NOT_FOUND_OR_INACTIVE;

      return verifiedUser;
    } catch (error) {
      return error;
    }
  }
}

export default UseCaseVerifyUser;
