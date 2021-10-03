import {gql} from 'apollo-server-core';

const AUTHORIZATION_TYPES = gql`
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

export default AUTHORIZATION_TYPES;
