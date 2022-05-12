import {gql} from 'apollo-server-core';

const USER_TYPES = gql`
  """
  Username data model
  """
  type Username {
    first: String
    last: String
  }

  """
  User address data model
  """
  type UserAddress {
    state: String
    city: String
    street: String
    subdivision: String
    lane: String
    house: String
    zip: String
  }

  """
  User data model
  """
  type User @key(fields: "id") {
    id: ID!
    name: Username
    email: EmailAddress
    avatar: String
    gender: String
    authorization: Authorization
    about: String
    githubUrl: String
    isActive: Boolean
    isSuper: Boolean
    address: UserAddress
    createdAt: Date
    updatedAt: Date
  }

  #
  # ######### List users ##################
  #

  input UsernameInput {
    first: String
    last: String
  }

  """
  Filtering configuration by fields.
  """
  input UsersFilterInput {
    id: [ID]
    email: EmailAddress
    name: UsernameInput
    gender: String
    createAt: String
    updatedAt: String
    _or: [UsersFilterInput]
    _and: [UsersFilterInput]
    _eq: UsersFilterInput
    _gt: UsersFilterInput
    _gte: UsersFilterInput
    _in: [UsersFilterInput]
    _lt: UsersFilterInput
    _lte: UsersFilterInput
    _neq: UsersFilterInput
    _nin: [UsersFilterInput]
  }

  enum SortingEnum {
    ASC
    DESC
  }

  """
  Single sorting configuration by field name and direction. An object of \`key\` \`direction\` properties is required when applying for sorting.
  """
  input SortingByFieldInput {
    id: SortingEnum
    email: SortingEnum
    firstName: SortingEnum
    lastName: SortingEnum
    gender: SortingEnum
    createdAt: SortingEnum
    updatedAt: SortingEnum
  }

  """
  Input configuration to gather or arrange a list in their proper sequence. You can set filtering,sorting,paginating arguments for more specification.
  This configuration applied on queries with a prefixed name of \`list*\`
  """
  input ListUsersCollateInput {
    filter: UsersFilterInput
    sort: SortingByFieldInput
    page: PaginationInput
  }

  #
  # ######### Create user ##################
  #
  input CreateUserInput {
    email: EmailAddress!
    password: Password!
    avatar: String
    firstName: String
    lastName: String
  }

  #
  # ######### Update user ##################
  #
  input UpdateUserInput {
    id: ID!
    avatar: String
    firstName: String
    lastName: String
  }

  #
  # ######### Reset user password ##################
  #
  input ResetPasswordInput {
    verificationId: ID!
    userId: ID!
    newPassword: Password!
  }
`;

export default USER_TYPES;
