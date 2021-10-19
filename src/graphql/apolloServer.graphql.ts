import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import {ApolloServer} from 'apollo-server-express';
import {logger} from 'src/services';
import {counter, histogram} from 'src/services/prometheus.service';

import environment from '../config/environment';
import monitorPerformance from './plugins/monitorPerformance.plugin';
import {AuthenticationDataSource, UserDataSource} from './resolvers';
import schema from './schema.graphql';

const {IS_PRODUCTION} = environment;

const apolloServer = new ApolloServer({
  debug: !IS_PRODUCTION,
  introspection: !IS_PRODUCTION, // Disable Graphql playground on production.
  schema,
  formatError: (graphqlError) => {
    logger.error(graphqlError);
    return graphqlError;
  },
  plugins: [
    monitorPerformance,
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  dataSources: () => ({
    user: new UserDataSource(),
    auth: new AuthenticationDataSource(),
  }),
  context: async ({req, res}) => ({req, res, histogram, counter}),
});

export default apolloServer;
