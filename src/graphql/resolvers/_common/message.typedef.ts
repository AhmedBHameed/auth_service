import {gql} from 'apollo-server-core';

const COMMON_MESSAGE_TYPES = gql`
  type Message {
    message: String
  }
`;

export default COMMON_MESSAGE_TYPES;
