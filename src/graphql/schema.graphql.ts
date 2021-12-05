import {buildSubgraphSchema} from '@apollo/federation';
import {mergeResolvers, mergeTypeDefs} from '@graphql-tools/merge';
import {gql} from 'apollo-server-express';
import {writeFileSync} from 'fs';
import {printIntrospectionSchema} from 'graphql';
import {
  EmailAddressResolver,
  EmailAddressTypeDefinition as EMAIL_ADDRESS_TYPE_DEFINITION,
  PositiveIntResolver,
  PositiveIntTypeDefinition as POSITIVE_INT_TYPE_DEFINITION,
} from 'graphql-scalars';

import {
  AUTHENTICATION_TYPES,
  AuthenticationResolvers,
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

  type Message {
    message: String
  }

  extend type Query {
    #
    # ########################### Authentication queries ################################
    #
    createTokens(input: AuthInput!): Auth
    refreshTokens: Auth
    clearTokens: Message
    getUser(id: ID!): User

    #
    # ########################### Permissions queries ################################
    #
    getUserAuthorization(id: ID!): Authorization
    listUsers(input: ListUsersCollateInput): [User]

    querier: Querier
  }

  # MUTATIONS
  extend type Mutation {
    #
    # ########################### User mutation ################################
    #
    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User
    resetPassword(input: ResetPasswordInput!): Message
    """
    Set user access to forbidden. User in this case should reset their password to reactivate and change password.
    """
    invalidateUserToken(userId: ID!): Message

    #
    # ########################### User mutation ################################
    #
    updateAuthorization(input: AuthorizationInput!): Authorization

    mutator: Mutator
  }
`;

const federatedSchema = buildSubgraphSchema([
  {
    typeDefs: mergeTypeDefs([
      'scalar Password',
      'scalar RequiredString',
      EMAIL_ADDRESS_TYPE_DEFINITION,
      POSITIVE_INT_TYPE_DEFINITION,
      USER_TYPES,
      AUTHENTICATION_TYPES,
      COMMON_PAGINATION_INPUT_CONFIG_TYPES,
      typeDefs,
    ]),
    resolvers: mergeResolvers([
      {Password: passwordScalar},
      {EmailAddress: EmailAddressResolver},
      {RequiredString: requiredStringScalar},
      {PositiveInt: PositiveIntResolver},
      UserResolvers,
      AuthenticationResolvers,
    ]) as any,
  },
]);

const graphqlSchemaObj = printIntrospectionSchema(federatedSchema);

writeFileSync('./schemas.graphql', graphqlSchemaObj);

// const schema = lowerCaseDirectiveTransformer(federatedSchema, 'lowerCase');

export default federatedSchema;
