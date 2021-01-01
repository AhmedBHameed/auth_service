import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {omit} from 'lodash';
import {ErrorResponse, INVALID_PASSWORD, VALIDATION_ERROR} from 'src/errors';
import TYPES from 'src/models/DI/types';
import {GenerateTokenInput} from 'src/models/generateTokenInput';
import JwtLocator from 'src/services/JwtLocator';
import UseCaseCreateUser, {CreateUserInput} from 'src/use-cases/UseCaseCreateUser';
import UseCaseDeleteUser, {DeleteUserData} from 'src/use-cases/UseCaseDeleteUser';
import UseCaseFindUser, {FindUserByIdData} from 'src/use-cases/UseCaseFindUser';
import UseCaseFindUsers, {FindUsersData} from 'src/use-cases/UseCaseFindUsers';
import UseCaseForgotUserPassword, {ForgotPasswordUserInput} from 'src/use-cases/UseCaseForgotUserPassword';
import UseCaseResetPassword, {ResetUserPasswordInput} from 'src/use-cases/UseCaseResetPassword';
import UseCaseSearchUser, {SearchUserData} from 'src/use-cases/UseCaseSearchUser';
import UseCaseUpdateUser, {UpdateUserInput} from 'src/use-cases/UseCaseUpdateUser';
import UseCaseVerifyUser, {VerifyUserInput} from 'src/use-cases/UseCaseVerifyUser';
import {getUserRole} from 'src/util/getUserRole';
import {ulid} from 'ulid';

import {hasJsonWebTokenError, NO_AUTHORIZATION_FOUND, hasTokenExpireError, INVALID_TOKEN_SIGNATURE} from 'src/errors';

@injectable()
class UserDataController {
  @inject(TYPES.JwtLocator)
  private _jwt!: JwtLocator;

  @inject(TYPES.UseCaseCreateUser)
  private _createUser!: UseCaseCreateUser;

  @inject(TYPES.UseCaseFindUsers)
  private _findUsers!: UseCaseFindUsers;

  @inject(TYPES.UseCaseFindUser)
  private _findUser!: UseCaseFindUser;

  @inject(TYPES.UseCaseUpdateUser)
  private _updateUser!: UseCaseUpdateUser;

  @inject(TYPES.UseCaseDeleteUser)
  private _deleteUser!: UseCaseDeleteUser;

  @inject(TYPES.UseCaseVerifyUser)
  private _verifyUser!: UseCaseVerifyUser;

  @inject(TYPES.UseCaseResetPassword)
  private _resetPassword!: UseCaseResetPassword;

  @inject(TYPES.UseCaseForgotUserPassword)
  private _forgotPassword!: UseCaseForgotUserPassword;

  @inject(TYPES.UseCaseSearchUser)
  private _searchUsers!: UseCaseSearchUser;

  async GenerateToken(req: Request, res: Response): Promise<void> {
    const inputData = req.body as GenerateTokenInput;

    const validationResult = this._findUser.validate(inputData);
    const userAccountResult = await this._findUser.byEmail(validationResult);

    if (userAccountResult instanceof ErrorResponse) {
      res.status(userAccountResult.statusCode).send(userAccountResult);
      return;
    }

    const isValidPassword = this._jwt.verifiedPassword(validationResult.value.password, userAccountResult.password);
    if (!isValidPassword) {
      res.status(INVALID_PASSWORD.statusCode).send(INVALID_PASSWORD);
      return;
    }

    const userAccountRole = getUserRole(userAccountResult.roles, inputData.appName);

    if (!userAccountRole) {
      res.status(NO_AUTHORIZATION_FOUND.statusCode).send(NO_AUTHORIZATION_FOUND);
      return;
    }

    const tokens = this._jwt.createToken({
      id: userAccountResult._id,
      role: userAccountRole || '',
    });
    res.send({...tokens, userRole: userAccountRole});
  }

  async RefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const {refreshToken, appName} = req.body as {refreshToken: string; appName: string};
      const tokenData = this._jwt.verifyToken(refreshToken);

      const userAccountValidationOrError = await this._findUser.validateTokenData({
        id: tokenData.data.id,
        role: `${appName}_${tokenData.data.role}`,
      });
      if (userAccountValidationOrError instanceof ErrorResponse) {
        res.status(userAccountValidationOrError.statusCode).send(userAccountValidationOrError);
        return;
      }

      const tokens = this._jwt.createToken({...tokenData.data});
      res.send({...tokens, ...tokenData.data});
    } catch (error) {
      const tokenExpireError = hasTokenExpireError(error);
      if (tokenExpireError) {
        res.status(400).send(tokenExpireError);
        return;
      }

      const jsonWebTokenError = hasJsonWebTokenError(error);
      if (jsonWebTokenError) {
        res.status(400).send(jsonWebTokenError);
        return;
      }

      res.status(INVALID_TOKEN_SIGNATURE.statusCode).send(INVALID_TOKEN_SIGNATURE);
    }
  }

  async VerifyToken(req: Request, res: Response): Promise<void> {
    try {
      const {accessToken} = req.body as {accessToken: string; appName: string};
      const tokenData = this._jwt.verifyToken(accessToken);

      res.send(tokenData.data);
    } catch (error) {
      const tokenExpireError = hasTokenExpireError(error);
      if (tokenExpireError) {
        res.status(400).send(tokenExpireError);
        return;
      }

      const jsonWebTokenError = hasJsonWebTokenError(error);
      if (jsonWebTokenError) {
        res.status(400).send(jsonWebTokenError);
        return;
      }

      res.status(INVALID_TOKEN_SIGNATURE.statusCode).send(INVALID_TOKEN_SIGNATURE);
    }
  }

  async SearchUsers(req: Request, res: Response): Promise<void> {
    try {
      const searchData = req.body as SearchUserData;
      const validationResult = this._searchUsers.validate(searchData);
      const searchUsersResult = await this._searchUsers.run(validationResult);

      if (searchUsersResult instanceof ErrorResponse) {
        res.status(searchUsersResult.statusCode).send(searchUsersResult);
        return;
      }

      const users = searchUsersResult.map(userModel => ({
        ...omit(userModel.toObject(), ['roles']),
        role: getUserRole(userModel.roles, searchData.appName),
      }));

      res.send(users);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async FindAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const inputData = req.body as FindUsersData;
      const validationResult = this._findUsers.validate(inputData);
      const userAccountOrError = await this._findUsers.run(validationResult);

      if (userAccountOrError instanceof ErrorResponse) {
        res.status(userAccountOrError.statusCode).send(userAccountOrError);
        return;
      }

      const userAccountRole = userAccountOrError.map(userModel => ({
        ...omit(userModel.toObject(), ['roles']),
        role: getUserRole(userModel.roles, inputData.appName),
      }));

      res.send(userAccountRole);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async FindUserById(req: Request, res: Response): Promise<void> {
    try {
      const inputData = req.body as FindUserByIdData;
      const validationResult = this._findUser.validateById(inputData);
      const userAccountResult = await this._findUser.byId(validationResult);

      if (userAccountResult instanceof ErrorResponse) {
        res.status(userAccountResult.statusCode).send(userAccountResult);
        return;
      }

      const userAccount = userAccountResult.toObject();
      const role = getUserRole(userAccountResult.roles, inputData.appName);

      res.send({...omit(userAccount, ['roles']), role});
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async CreateUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = this._createUser.validate({
        ...(req.body as CreateUserInput),
        verificationId: ulid(),
      });

      if (validationResult.error) {
        res.status(422).send(VALIDATION_ERROR(validationResult.error));
        return;
      }

      const {password, passwordSalt} = this._jwt.getSaltAndHashedPassword(validationResult.value.password);
      validationResult.value.password = password;
      validationResult.value.passwordSalt = passwordSalt;
      const newUserAccount = await this._createUser.run(validationResult);
      res.send(newUserAccount);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async UpdateUser(req: Request, res: Response): Promise<void> {
    try {
      const inputData = req.body as UpdateUserInput;
      const validationResult = this._updateUser.validate(inputData);

      const userAccountResult = await this._updateUser.run(validationResult);
      if (userAccountResult instanceof ErrorResponse) {
        res.status(userAccountResult.statusCode).send(userAccountResult);
        return;
      }

      const role = getUserRole(userAccountResult.roles, inputData.appName);
      res.send({...omit(userAccountResult.toObject(), 'roles'), role});
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async VerifyUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = this._verifyUser.validate(req.body as VerifyUserInput);
      const userAccountOrError = await this._verifyUser.run(validationResult);
      res.send(userAccountOrError);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async ForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = this._forgotPassword.validate(req.body as ForgotPasswordUserInput);
      const userAccountOrError = await this._forgotPassword.run(validationResult);
      res.send(userAccountOrError);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async DeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = this._deleteUser.validate(req.body as DeleteUserData);
      const userData = await this._deleteUser.run(validationResult);
      res.send(userData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async ResetPassword(req: Request, res: Response): Promise<void> {
    const validationResult = this._resetPassword.validate(req.body as ResetUserPasswordInput);

    if (validationResult.error) {
      res.status(422).send(VALIDATION_ERROR(validationResult.error));
      return;
    }

    const {password, passwordSalt} = this._jwt.getSaltAndHashedPassword(validationResult.value.password);
    validationResult.value.password = password;
    validationResult.value.passwordSalt = passwordSalt;
    const userAccountOrError = await this._resetPassword.run(validationResult);
    if (userAccountOrError instanceof ErrorResponse) {
      res.status(userAccountOrError.statusCode).send(userAccountOrError);
      return;
    }

    res.send({message: 'Your password has been reset successfully.'});
  }
}

export default UserDataController;
