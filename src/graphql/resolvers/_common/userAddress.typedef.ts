import {gql} from 'apollo-server-core';

const COMMON_USER_ADDRESS_TYPES = gql`
  """
  UserAddress data model
  """
  type UserAddress {
    country: String
    city: String
    street: String
    postalCode: String
  }
`;

export default COMMON_USER_ADDRESS_TYPES;
