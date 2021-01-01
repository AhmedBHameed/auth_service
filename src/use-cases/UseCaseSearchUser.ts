import {injectable} from 'inversify';
import UserModel, {IUserModel} from 'src/database/UserModel';

import Joi from '@hapi/joi';

import {ValidationResultData} from './helper/ValidationResultData';
import {DATABASE_ERROR, ErrorResponse, USER_NOT_FOUND, VALIDATION_ERROR} from 'src/errors';

const NONE_SENSITIVE_COLUMNS = ['-password', '-passwordSalt', '-attemptOfResetPassword'];

export interface SearchUserData {
  search: string;
  appName: string;
}

type SearchUserDataSchema = SearchUserData;

const searchUserValidationSchema = Joi.object<SearchUserDataSchema>({
  search: Joi.string().optional(),
  appName: Joi.string().required(),
});

@injectable()
class UseCaseSearchUser {
  public validate(data: SearchUserDataSchema): Joi.ValidationResult {
    return searchUserValidationSchema.validate(data, {abortEarly: false});
  }

  public async run(data: ValidationResultData<SearchUserDataSchema>): Promise<IUserModel[] | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) return VALIDATION_ERROR(error);

      const searchRegexp = new RegExp(value.search, 'i');
      const users = await UserModel.find({
        $and: [
          {
            $or: [{email: searchRegexp}, {'name.first': searchRegexp}, {'name.last': searchRegexp}],
          },
        ],
      })
        .select(NONE_SENSITIVE_COLUMNS)
        .exec();

      if (!users) return USER_NOT_FOUND;

      return users;
    } catch (error) {
      return DATABASE_ERROR(error);
    }
  }
}

export default UseCaseSearchUser;
