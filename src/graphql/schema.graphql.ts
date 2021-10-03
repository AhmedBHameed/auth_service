import {buildFederatedSchema} from '@apollo/federation';
import {mergeResolvers, mergeTypeDefs} from '@graphql-tools/merge';
import {gql} from 'apollo-server-express';
import {
  EmailAddressResolver,
  EmailAddressTypeDefinition as EMAIL_ADDRESS_TYPE_DEFINITION,
  PositiveIntResolver,
  PositiveIntTypeDefinition as POSITIVE_INT_TYPE_DEFINITION,
} from 'graphql-scalars';

import {VerifyTokenResolvers} from './models';
import {
  AUTHENTICATION_TYPES,
  AuthenticationResolvers,
  AUTHORIZATION_TYPES,
  AuthorizationResolvers,
  COMMON_PAGINATION_INPUT_CONFIG_TYPES,
  USER_TYPES,
  UserResolvers,
} from './resolvers';
import passwordScalar from './resolvers/scalars/password.scaler';
import requiredStringScalar from './resolvers/scalars/requiredString.scalar';

const typeDefs = gql`
  """
  \`ISO 8601\` date format. E.g: 2021-08-09T09:45:16.696Z
  """
  scalar Date
  scalar Password
  scalar RequiredString

  type Message {
    message: String
  }

  extend type Query {
    #
    # ########################### Authentication section ################################
    #
    createTokens(input: AuthInput!): Auth
    refreshTokens: Auth
    clearTokens: Message
    verifyMe: VerifyToken

    #
    # ########################### Permissions section ################################
    #
    getUserAuthorization(id: ID!): Authorization
    getUser(id: ID!): User
    listUsers(input: ListUsersCollateInput): [User]
  }

  # MUTATIONS
  extend type Mutation {
    #
    # ########################### User section ################################
    #
    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User

    #
    # ########################### User section ################################
    #
    updateAuthorization(input: AuthorizationInput!): Authorization
  }
`;

const federatedSchema = buildFederatedSchema([
  {
    typeDefs: mergeTypeDefs([
      EMAIL_ADDRESS_TYPE_DEFINITION,
      POSITIVE_INT_TYPE_DEFINITION,
      USER_TYPES,
      AUTHENTICATION_TYPES,
      AUTHORIZATION_TYPES,
      COMMON_PAGINATION_INPUT_CONFIG_TYPES,
      typeDefs,
    ]),
    resolvers: mergeResolvers([
      {Password: passwordScalar},
      {EmailAddress: EmailAddressResolver},
      {RequiredString: requiredStringScalar},
      {PositiveInt: PositiveIntResolver},
      {
        VerifyToken:
          AuthenticationResolvers.VerifyToken as VerifyTokenResolvers,
      },
      UserResolvers,
      AuthenticationResolvers,
      AuthorizationResolvers,
    ]) as any,
  },
]);

// const schema = lowerCaseDirectiveTransformer(federatedSchema, 'lowerCase');

export default federatedSchema;
