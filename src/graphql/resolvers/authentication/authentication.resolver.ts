import {Resolvers} from '../../models/resolvers-types.model';

const querierAndMutatorVerifierFun = async (_, __, {req, dataSources}) => {
  const {auth, user} = dataSources;
  const accessToken = req.cookies.ACCESS_TOKEN;
  const tokenPayload = await auth.verifyAccessToken(accessToken || '');

  const {id, verificationId, isSuper} = tokenPayload.data;

  await user.checkUserVerificationId(id, verificationId);
  const userAuthorization = await auth.getUserAuthorization(id);

  return {
    id,
    verificationId,
    userActionsAsJson: JSON.stringify(userAuthorization.actions),
    isSuper,
  };
};

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
    querier: querierAndMutatorVerifierFun,
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
    getUserAuthorization: async (_, __, {req, dataSources}) => {
      const {auth} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;

      const {data} = await auth.verifyAccessToken(accessToken);

      const userPermission = await auth.getUserAuthorization(data.id);

      return userPermission;
    },
  },
  Mutation: {
    mutator: querierAndMutatorVerifierFun,
    updateAuthorization: async (_, {input}, {req, dataSources}) => {
      const {auth} = dataSources;

      const accessToken = req.cookies.ACCESS_TOKEN;

      await auth.isAuthorizedUser(accessToken, {
        modelName: 'authorizations',
        permission: 'update',
      });

      const userAuthorization = await auth.updateAuthorization(input);
      return userAuthorization;
    },
  },
};

export default AuthenticationResolvers;
