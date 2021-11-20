import {gql} from 'apollo-server-core';

const COMMON_PAGINATION_INPUT_CONFIG_TYPES = gql`
  """
  Pagination input config. An object of \`page\`, \`size\` properties is required to apply pagination.

  Minimum number for \`page\` is 1.

  Min number for \`size\` is 10.

  Max number for \`size\` is 50.
  """
  input PaginationInput {
    number: PositiveInt!
    size: PositiveInt!
  }
`;

export default COMMON_PAGINATION_INPUT_CONFIG_TYPES;
