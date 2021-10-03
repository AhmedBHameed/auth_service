import {GraphQLRequest} from 'apollo-server-core';
import {DocumentNode} from 'graphql';
import {IncomingHttpHeaders, IncomingMessage, OutgoingMessage} from 'http';
import {Socket} from 'net';
import apolloServer from 'src/graphql/apolloServer.graphql';

const mockApolloServer = (
  request: Omit<GraphQLRequest, 'query'> & {
    query?: string | DocumentNode | undefined;
  },
  context?: any
) => apolloServer.executeOperation(request, context);

const buildContext = (context?: {headers: IncomingHttpHeaders}) => {
  const incomingRequest: IncomingMessage = new IncomingMessage(new Socket());
  const outgoingMessage: OutgoingMessage = new OutgoingMessage();

  return {
    req: {
      ...incomingRequest,
      headers: {
        ...incomingRequest.headers,
        ...context?.headers,
      },
    },
    res: outgoingMessage,
  };
};

export {buildContext,mockApolloServer};
