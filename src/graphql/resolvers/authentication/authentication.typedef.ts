import {gql} from 'apollo-server-core';

const AUTHENTICATION_TYPES = gql`
  """
  Authentication input model
  """
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

  type VerifyToken {
    id: ID
    isSuper: Boolean
    actions: [UserAction]
  }
`;

export default AUTHENTICATION_TYPES;
