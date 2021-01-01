const TYPES = {
  Logger: Symbol.for('Logger'),
  AuthenticationBus: Symbol.for('AuthenticationBus'),
  JwtLocator: Symbol.for('JwtLocator'),
  MongoConnectionLocator: Symbol.for('MongoConnectionLocator'),
  // Controllers
  UserDataController: Symbol.for('UserDataController'),
  // User cases
  UseCaseFindUsers: Symbol.for('UseCaseFindUsers'),
  UseCaseFindUser: Symbol.for('UseCaseFindUser'),
  UseCaseCreateUser: Symbol.for('UseCaseCreateUser'),
  UseCaseUpdateUser: Symbol.for('UseCaseUpdateUser'),
  UseCaseDeleteUser: Symbol.for('UseCaseDeleteUser'),
  UseCaseVerifyUser: Symbol.for('UseCaseVerifyUser'),
  UseCaseResetPassword: Symbol.for('UseCaseResetPassword'),
  UseCaseChangePassword: Symbol.for('UseCaseChangePassword'),
  UseCaseForgotUserPassword: Symbol.for('UseCaseForgotUserPassword'),
  UseCaseSearchUser: Symbol.for('UseCaseSearchUser'),
};

export default TYPES;
