/**
 * To read more about apollo server plugins @see https://www.apollographql.com/docs/apollo-server/v2/integrations/plugins/
 * */
import {
  ApolloServerPlugin,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';

import {Context} from '../models';

const monitorPerformance: ApolloServerPlugin<Context> = {
  async requestDidStart(): Promise<GraphQLRequestListener<Context>> {
    const start = new Date().getTime();
    // if (request.operationName)
    //   context.sentryTransaction.setName(request.operationName!);

    return {
      // async executionDidStart() {
      //   return {
      //     willResolveField(
      //       reqContext: GraphQLFieldResolverParams<any, Context>
      //     ) {
      //       // hook for each new resolver
      //       const span = reqContext.context.sentryTransaction.startChild({
      //         op: 'resolver',
      //         description: `${reqContext.info.parentType.name}.${reqContext.info.fieldName}`,
      //       });
      //       return () => {
      //         // this will execute once the resolver is finished
      //         span.finish();
      //       };
      //     },
      //   };
      // },
      async willSendResponse(
        requestContext: GraphQLRequestContextWillSendResponse<Context>
      ) {
        // hook for transaction finished
        // requestContext.context.sentryTransaction.finish();
        const end = new Date().getTime() - start;
        requestContext.context.histogram.observe(end / 1000);
        requestContext.context.counter.inc();
      },
    };
  },
};

export default monitorPerformance;
