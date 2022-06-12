import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import {ApolloServer} from 'apollo-server-express';
import {logger} from 'src/services';
import {counter, histogram} from 'src/services/prometheus.service';

import {IS_PRODUCTION} from '../config/environment';
import monitorPerformance from './plugins/monitorPerformance.plugin';
import {authDataSource, userDataSource} from './resolvers';
import schema from './schema.graphql';

const plugins = [monitorPerformance];
if (!IS_PRODUCTION)
  plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());

const apolloServer = new ApolloServer({
  debug: !IS_PRODUCTION,
  introspection: !IS_PRODUCTION, // Disable Graphql playground on production.
  schema,
  formatError: (graphqlError) => {
    logger.error(graphqlError);
    return graphqlError;
  },
  plugins,
  dataSources: () => ({
    user: userDataSource,
    auth: authDataSource,
  }),
  context: async ({req, res}) => ({req, res, histogram, counter}),
});

export default apolloServer;
