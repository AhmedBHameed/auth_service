import {Container} from 'inversify';
import UserDataController from 'src/Controller/UserDataController';
import TYPES from 'src/models/DI/types';
import JwtLocator from 'src/services/JwtLocator';
import logger, {Logger} from 'src/services/Logger';
import MongoConnectionLocator from 'src/services/MongoConnectionLocator';
import UseCaseChangePassword from 'src/use-cases/UseCaseChangePassword';
import UseCaseCreateUser from 'src/use-cases/UseCaseCreateUser';
import UseCaseDeleteUser from 'src/use-cases/UseCaseDeleteUser';
import UseCaseFindUser from 'src/use-cases/UseCaseFindUser';
import UseCaseFindUsers from 'src/use-cases/UseCaseFindUsers';
import UseCaseForgotUserPassword from 'src/use-cases/UseCaseForgotUserPassword';
import UseCaseResetPassword from 'src/use-cases/UseCaseResetPassword';
import UseCaseSearchUser from 'src/use-cases/UseCaseSearchUser';
import UseCaseUpdateUser from 'src/use-cases/UseCaseUpdateUser';
import UseCaseVerifyUser from 'src/use-cases/UseCaseVerifyUser';

export default (): Container => {
  const container = new Container();
  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
  container.bind<MongoConnectionLocator>(TYPES.MongoConnectionLocator).to(MongoConnectionLocator).inSingletonScope();
  container.bind<JwtLocator>(TYPES.JwtLocator).to(JwtLocator).inSingletonScope();

  // Controllers
  container.bind<UserDataController>(TYPES.UserDataController).to(UserDataController).inSingletonScope();
  // User cases
  container.bind<UseCaseFindUsers>(TYPES.UseCaseFindUsers).to(UseCaseFindUsers).inSingletonScope();
  container.bind<UseCaseFindUser>(TYPES.UseCaseFindUser).to(UseCaseFindUser).inSingletonScope();

  container.bind<UseCaseCreateUser>(TYPES.UseCaseCreateUser).to(UseCaseCreateUser).inSingletonScope();
  container.bind<UseCaseUpdateUser>(TYPES.UseCaseUpdateUser).to(UseCaseUpdateUser).inSingletonScope();
  container.bind<UseCaseDeleteUser>(TYPES.UseCaseDeleteUser).to(UseCaseDeleteUser).inSingletonScope();
  container.bind<UseCaseVerifyUser>(TYPES.UseCaseVerifyUser).to(UseCaseVerifyUser).inSingletonScope();
  container.bind<UseCaseChangePassword>(TYPES.UseCaseChangePassword).to(UseCaseChangePassword).inSingletonScope();
  container.bind<UseCaseResetPassword>(TYPES.UseCaseResetPassword).to(UseCaseResetPassword).inSingletonScope();
  container.bind<UseCaseSearchUser>(TYPES.UseCaseSearchUser).to(UseCaseSearchUser).inSingletonScope();

  container
    .bind<UseCaseForgotUserPassword>(TYPES.UseCaseForgotUserPassword)
    .to(UseCaseForgotUserPassword)
    .inSingletonScope();

  return container;
};
