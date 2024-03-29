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
    # ######### Authentication queries #########
    #
    createTokens(input: AuthInput!): Auth
    githubLogin(code: ID!): Auth
    refreshTokens: Auth
    clearTokens: Message
    verifyMe: User
    getUser(id: ID!): User

    #
    # ######### Permissions queries #########
    #
    getUserAuthorization(id: ID!): Authorization
    listUsers(query: String): [User]

    querier: Querier
  }

  # MUTATIONS
  extend type Mutation {
    signup(input: SignupInput!): Message
    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User
    deleteUser(id: ID!): Message
    forgotPassword(email: EmailAddress!): Message
    resetPassword(input: ResetPasswordInput!): Message
    activateUserAccount(hash: String!): Message
    invalidateUserToken(userId: ID!): Message

    #
    # ######### User mutation #########
    #
    upsertAuthorization(input: AuthorizationInput!): Authorization

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
