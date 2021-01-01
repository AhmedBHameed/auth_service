import {injectable} from 'inversify';
import UserModel, {IUserModel} from 'src/database/UserModel';

import Joi from '@hapi/joi';

import {ValidationResultData} from './helper/ValidationResultData';
import {DATABASE_ERROR, ErrorResponse, VALIDATION_ERROR} from 'src/errors';
import {USER_NOT_FOUND_OR_INACTIVE} from 'src/errors/userNotFoundOrInactive';

export interface DeleteUserData {
  id: string;
}

type DeleteUserDataSchema = DeleteUserData;

const deleteUserValidationSchema = Joi.object<DeleteUserDataSchema>({
  id: Joi.string().required(),
});

@injectable()
class UseCaseDeleteUser {
  public validate = (data: DeleteUserDataSchema): Joi.ValidationResult => {
    return deleteUserValidationSchema.validate(data, {abortEarly: false});
  };

  public async run(data: ValidationResultData<DeleteUserDataSchema>): Promise<IUserModel | null | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) return VALIDATION_ERROR(error);

      const deletedUser = await UserModel.findByIdAndDelete(value.id).select([
        '-password',
        '-passwordSalt',
        '-attemptOfResetPassword',
        '-verificationId',
        '-status',
      ]);
      if (!deletedUser) return USER_NOT_FOUND_OR_INACTIVE;

      return deletedUser;
    } catch (error) {
      return DATABASE_ERROR(error);
    }
  }
}

export default UseCaseDeleteUser;
