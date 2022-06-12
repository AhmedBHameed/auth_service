import COMMON_PAGINATION_INPUT_CONFIG_TYPES from './_common/paginationInputConfig.typedef';
import authDataSource, {
  AuthDataSource,
} from './authentication/authentication.datasource';
import AuthenticationResolvers from './authentication/authentication.resolver';
import AUTHENTICATION_TYPES from './authentication/authentication.typedef';
import userDataSource, {UserDataSource} from './user/user.datasource';
import UserResolvers from './user/user.resolvers';
import USER_TYPES from './user/user.typedef';

// Resolvers
export {AuthenticationResolvers, UserResolvers};

// APIs
export {authDataSource, userDataSource};

// Types
export {AUTHENTICATION_TYPES, COMMON_PAGINATION_INPUT_CONFIG_TYPES, USER_TYPES};

// typescript types
export {AuthDataSource, UserDataSource};
