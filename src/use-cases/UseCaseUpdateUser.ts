import {injectable} from 'inversify';
import UserModel, {IUserModel, UserAddress, UserStatus} from 'src/database/UserModel';

import Joi from '@hapi/joi';

import {ValidationResultData} from './helper/ValidationResultData';
import {DATABASE_ERROR, ErrorResponse, VALIDATION_ERROR} from 'src/errors';
import {USER_NOT_FOUND_OR_INACTIVE} from 'src/errors/userNotFoundOrInactive';

export interface UpdateUserInput {
  id: string;
  status?: UserStatus;
  name?: {
    first: string;
    last: string;
  };
  gender?: string;
  avatar?: string;
  address?: UserAddress;
  role: string;
  appName: string;
}

type UpdateUserDataSchema = UpdateUserInput;

const updateUserValidationSchema = Joi.object<UpdateUserDataSchema>({
  id: Joi.string().required(),
  status: Joi.valid(UserStatus.ACTIVE, UserStatus.INACTIVE).optional(),
  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().required(),
  }).optional(),
  gender: Joi.string().optional(),
  avatar: Joi.string().optional().allow(''),
  role: Joi.string(),
  address: Joi.object<UserAddress>({
    state: Joi.string().allow(''),
    city: Joi.string().allow(''),
    house: Joi.string().allow(''),
    lane: Joi.string().allow(''),
    street: Joi.string().allow(''),
    subdivision: Joi.string().allow(''),
    zip: Joi.string().allow(''),
  }).optional(),
  appName: Joi.string().required(),
});

@injectable()
class UserCaseUpdateUser {
  public validate = (data: UpdateUserDataSchema): Joi.ValidationResult => {
    return updateUserValidationSchema.validate(data, {abortEarly: false});
  };

  public async run(data: ValidationResultData<UpdateUserDataSchema>): Promise<IUserModel | ErrorResponse> {
    try {
      const {error, value} = data;

      if (error) return VALIDATION_ERROR(error);

      const userAccount = await UserModel.findById(value.id).select(['roles']).exec();

      if (!userAccount) return USER_NOT_FOUND_OR_INACTIVE;

      const restOfRoles = userAccount.roles.filter(role => !role.startsWith(value.appName));
      restOfRoles.push(`${value.appName}_${value.role}`);

      const updatedUser = await UserModel.findOneAndUpdate(
        {_id: value.id},
        {
          status: value.status,
          name: value.name,
          gender: value.gender,
          avatar: value.avatar,
          roles: restOfRoles,
          address: value.address,
        },
        {new: true}
      )
        .select(['-verificationId', '-passwordSalt', '-password'])
        .exec();

      return updatedUser as IUserModel;
    } catch (error) {
      return DATABASE_ERROR(error);
    }
  }
}

export default UserCaseUpdateUser;
