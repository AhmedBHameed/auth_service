import {Resolvers} from '../../models/resolvers-types.model';

const AuthenticationResolvers: Resolvers = {
  VerifyToken: {
    actions: async ({actions}) => actions || [],
  },
  Query: {
    createTokens: async (_, {input}, {dataSources}) => {
      const {createTokens} = dataSources.authentication;
      const tokens = await createTokens({
        email: input.email,
        password: input.password,
      });
      return tokens;
    },
    verifyMe: async (_, __, {req, dataSources}) => {
      const {authentication, user} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;
      const tokenPayload = await authentication.verifyAccessToken(
        accessToken || ''
      );

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
      const {authentication, user} = dataSources;
      const refreshToken = req.cookies.REFRESH_TOKEN;

      const {tokens, payload} = await authentication.refreshTokens(
        refreshToken
      );

      await user.checkUserVerificationId(payload.id, payload.verificationId);

      return tokens;
    },
    clearTokens: () => ({
      message: 'Token has been cleared!',
    }),
  },
};

export default AuthenticationResolvers;
