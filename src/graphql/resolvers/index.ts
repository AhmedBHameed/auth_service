import COMMON_PAGINATION_INPUT_CONFIG_TYPES from './_common/paginationInputConfig.typedef';
import AuthenticationDataSource from './authentication/authentication.datasource';
import AuthenticationResolvers from './authentication/authentication.resolver';
import AUTHENTICATION_TYPES from './authentication/authentication.typedef';
import AuthorizationDataSource from './authorization/authorization.datasource';
import AuthorizationResolvers from './authorization/authorization.resolver';
import AUTHORIZATION_TYPES from './authorization/authorization.typedef';
import UserDataSource from './user/user.datasource';
import UserResolvers from './user/user.resolvers';
import USER_TYPES from './user/user.typedef';

// Resolvers
export {AuthenticationResolvers, AuthorizationResolvers, UserResolvers};

// APIs
export {AuthenticationDataSource, AuthorizationDataSource, UserDataSource};

// Types
export {
  AUTHENTICATION_TYPES,
  AUTHORIZATION_TYPES,
  COMMON_PAGINATION_INPUT_CONFIG_TYPES,
  USER_TYPES,
};
