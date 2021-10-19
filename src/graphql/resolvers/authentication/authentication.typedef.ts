import {gql} from 'apollo-server-core';

const AUTHENTICATION_TYPES = gql`
  #
  # ################## Authentication input model ##################
  #
  input AuthInput {
    email: EmailAddress!
    password: Password!
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

  type Me @key(fields: "id") {
    id: ID!
    isSuper: Boolean
    actions: [UserAction]
  }

  #
  # ################## Authorization input model ##################
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

  #
  # ################## Update authorization ##################
  #
  input ActionInput {
    name: RequiredString!
    permissions: [RequiredString!]!
  }

  input AuthorizationInput {
    userId: ID
    actions: [ActionInput]!
  }
`;

export default AUTHENTICATION_TYPES;
