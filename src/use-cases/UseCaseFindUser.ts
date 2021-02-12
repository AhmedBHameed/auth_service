import {injectable} from 'inversify';
import UserModel, {IUserModel, UserStatus} from 'src/database/UserModel';
import {JWTPayload} from 'src/services/JwtLocator';

import Joi from '@hapi/joi';

import {ValidationResultData} from './helper/ValidationResultData';
import {DATABASE_ERROR, ErrorResponse, VALIDATION_ERROR} from 'src/errors';
import {USER_NOT_FOUND} from 'src/errors/userNotFound';
import {USER_NOT_FOUND_OR_INACTIVE} from 'src/errors/userNotFoundOrInactive';

const NONE_SENSITIVE_COLUMNS = ['-password', '-passwordSalt', '-attemptOfResetPassword'];

export interface FindUserByIdData {
  id: string;
  appName: string;
}

export interface LoginData {
  email: string;
  password: string;
  appName: string;
}

type FindUserByIdSchema = FindUserByIdData;
type LoginSchema = LoginData;

const findUserValidationSchema = Joi.object<FindUserByIdSchema>({
  id: Joi.string().optional(),
  appName: Joi.string().required(),
});
const findUserByEmailValidationSchema = Joi.object<LoginSchema>({
  email: Joi.string()
    .email({tlds: {allow: false}})
    .required(),
  password: Joi.string().required(),
  appName: Joi.string().required(),
  // extraData: [Joi.string().optional(), Joi.allow(null)],
});

@injectable()
class UseCaseFindUser {
  public validateById(data: FindUserByIdSchema): Joi.ValidationResult {
    return findUserValidationSchema.validate(data, {abortEarly: false});
  }

  public validate(data: LoginSchema): ValidationResultData<LoginSchema> {
    return findUserByEmailValidationSchema.validate(data, {abortEarly: false});
  }

  public async byId(data: ValidationResultData<FindUserByIdSchema>): Promise<IUserModel | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) return VALIDATION_ERROR(error);

      const userById = await UserModel.findById(value.id).select(NONE_SENSITIVE_COLUMNS).exec();

      if (!userById) return USER_NOT_FOUND;

      return userById;
    } catch (error) {
      return error;
    }
  }

  public async byEmail(data: ValidationResultData<LoginSchema>): Promise<IUserModel | ErrorResponse> {
    try {
      const {error, value} = data;

      if (error) return VALIDATION_ERROR(error);

      const userByEmail = await UserModel.findOne({
        email: value.email.toLowerCase(),
        status: UserStatus.ACTIVE,
      });

      if (!userByEmail) return USER_NOT_FOUND_OR_INACTIVE;

      return userByEmail;
    } catch (error) {
      return error;
    }
  }

  public async validateTokenData(data: JWTPayload): Promise<IUserModel | ErrorResponse> {
    try {
      const {id, role} = data;

      const userData = await UserModel.findOne({
        _id: id,
        status: UserStatus.ACTIVE,
        roles: {$in: [role]},
      }).select(['status', 'name', 'email', 'id', 'roles']);

      if (!userData) return USER_NOT_FOUND;

      return userData;
    } catch (error) {
      return DATABASE_ERROR(error);
    }
  }
}

export default UseCaseFindUser;
