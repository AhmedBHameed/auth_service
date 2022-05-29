import {gql} from 'apollo-server-core';

const AUTHENTICATION_TYPES = gql`
  #
  # ######### Authentication input model #########
  #
  input AuthInput {
    email: EmailAddress!
    password: Password!
    rememberMe: Boolean
  }

  """
  Authentication data model
  """
  type Auth {
    accessToken: String!
    refreshToken: String!
    accessTokenExpire: Int
    refreshTokenExpire: Int
  }

  #
  # ######### Authorization input model #########
  #
  type UserAction {
    name: String
    permissions: [String]
  }

  type Authorization {
    id: ID
    userId: ID
    actions: [UserAction]
    createdAt: Date
    updatedAt: Date
  }

  type Querier @key(fields: "id userActionsAsJson") {
    id: ID!
    userActionsAsJson: String!
    occupation: String
    about: String
    isSuper: Boolean
  }

  type Mutator @key(fields: "id userActionsAsJson") {
    id: ID!
    userActionsAsJson: String!
    occupation: String
    about: String
    isSuper: Boolean
  }

  #
  # ######### Signup #########
  #
  input SignupInput {
    email: EmailAddress!
    password: Password!
    firstName: String!
    lastName: String!
  }

  #
  # ######### Create/Update authorization #########
  #
  input ActionInput {
    name: RequiredString!
    permissions: [RequiredString!]!
  }

  input AuthorizationInput {
    userId: ID
    actions: [ActionInput!]!
  }
`;

export default AUTHENTICATION_TYPES;
