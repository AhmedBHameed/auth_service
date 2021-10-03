import {Resolvers} from '../../models/resolvers-types.model';

const AuthorizationResolvers: Resolvers = {
  Query: {
    getUserAuthorization: async () => ({}),
  },
  Mutation: {
    updateAuthorization: async (_, {input}, {req, dataSources}) => {
      console.log(
        '🚀 ~ file: authorization.resolver.ts ~ line 9 ~ updateAuthorization: ~ input',
        input
      );

      const {authorization, authentication} = dataSources;

      const accessToken = req.cookies.ACCESS_TOKEN;
      const payload = await authentication.verifyAccessToken(accessToken || '');

      await authorization.isAuthorizedUser(
        {modelName: 'authorizations', permission: 'read'},
        payload.data
      );

      const userAuthorization = await authorization.updateAuthorization(input);
      return userAuthorization;
    },
  },
};

export default AuthorizationResolvers;
