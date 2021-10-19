import {Resolvers} from '../../models/resolvers-types.model';

const AuthenticationResolvers: Resolvers = {
  VerifyToken: {
    actions: async ({actions}) => actions || [],
  },
  Query: {
    createTokens: async (_, {input}, {dataSources}) => {
      const {createTokens} = dataSources.auth;
      const tokens = await createTokens({
        email: input.email,
        password: input.password,
      });
      return tokens;
    },
    me: async (_, __, {req, dataSources}) => {
      const {auth, user} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;
      const tokenPayload = await auth.verifyAccessToken(accessToken || '');

      const {id, verificationId, actions, isSuper} = tokenPayload.data;

      await user.checkUserVerificationId(id, verificationId);

      return {
        id,
        verificationId,
        actions,
        isSuper,
      };
    },
    refreshTokens: async (_, __, {req, dataSources}) => {
      const {auth, user} = dataSources;
      const refreshToken = req.cookies.REFRESH_TOKEN;

      const {tokens, payload} = await auth.refreshTokens(refreshToken);

      await user.checkUserVerificationId(payload.id, payload.verificationId);

      return tokens;
    },
    clearTokens: () => ({
      message: 'Token has been cleared!',
    }),
    getUserAuthorization: async () => ({}),
  },
  Mutation: {
    updateAuthorization: async (_, {input}, {req, dataSources}) => {
      const {auth} = dataSources;

      const accessToken = req.cookies.ACCESS_TOKEN;

      await auth.isAuthorizedUser(accessToken, {
        modelName: 'authorizations',
        permission: 'read',
      });

      const userAuthorization = await accessToken.updateAuthorization(input);
      return userAuthorization;
    },
  },
};

export default AuthenticationResolvers;
