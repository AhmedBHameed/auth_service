import {injectable} from 'inversify';
import UserModel, {IUserModel} from 'src/database/UserModel';

import Joi from '@hapi/joi';

import {ValidationResultData} from './helper/ValidationResultData';
import {DATABASE_ERROR, ErrorResponse, VALIDATION_ERROR} from 'src/errors';

/**
 * INTERFACES
 */

export interface FindUsersData {
  page?: number;
  perPage?: number;
  appName: string;
}

/**
 * VERIFICATION SCHEMAS
 */
const findUsersValidationSchema = Joi.object<FindUsersData>({
  page: Joi.number().min(1).optional(),
  perPage: Joi.number().min(25).optional(),
  appName: Joi.string().required(),
});

/**
 * CLASS
 */
@injectable()
class UseCaseFindUsers {
  public validate = (data: FindUsersData): Joi.ValidationResult => {
    return findUsersValidationSchema.validate(data, {abortEarly: false});
  };

  public async run(data: ValidationResultData<FindUsersData>): Promise<IUserModel[] | ErrorResponse> {
    try {
      const {error, value} = data;
      if (error) return VALIDATION_ERROR(error);

      const page = value.page || 1;
      const perPage = value.perPage || 20;
      const users = await UserModel.find()
        .skip(perPage * (page - 1))
        .limit(perPage * page)
        .select(['-password', '-passwordSalt'])
        .exec();
      return users;
    } catch (error) {
      return DATABASE_ERROR(error);
    }
  }
}

export default UseCaseFindUsers;
