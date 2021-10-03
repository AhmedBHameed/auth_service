import {gql} from 'apollo-server-core';

const COMMON_PAGINATION_TYPES = gql`
  """
  Pagination data model
  """
  type Pagination {
    page: PositiveInt
    size: PositiveInt
  }
`;

export default COMMON_PAGINATION_TYPES;
