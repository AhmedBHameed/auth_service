import {SendMailOptions} from 'nodemailer';
import {APP_NAME, LOGO_SRC, MAIL_USER} from 'src/config/environment';
import {mailingQueue} from 'src/jobs/queues/mailing.queue';
import renderTemplate from 'src/services/renderTemplate.service';
import {ulid} from 'ulid';

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
    verifyMe: async (_, __, {req, dataSources}) => {
      const {auth, user} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;
      const tokenPayload = await auth.verifyAccessToken(accessToken || '');

      const {id} = tokenPayload.data;

      const responseResult = await user.getUserById(id);
      return responseResult;
    },
    createTokens: async (_, {input}, {dataSources}) => {
      const {createTokens} = dataSources.auth;
      const {rememberMe, ...reset} = input;
      const tokens = await createTokens(reset, rememberMe);
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
    signup: async (_, {input}, {dataSources}) => {
      const {user} = dataSources;

      const newUserResult = await user.createUser(input);

      await mailingQueue.add(
        {
          html: renderTemplate('views/activate-user-account.hbs', {
            logoSrc: LOGO_SRC,
            baseUrl: 'https://www.google.com',
            verificationId: newUserResult.verificationId,
            email: newUserResult.email,
          }),
          from: MAIL_USER,
          to: input.email,
          subject: `${APP_NAME} - Signup`,
        } as SendMailOptions,
        {
          jobId: ulid(),
          delay: 5000, // 1 min in ms
          attempts: 2,
        }
      );

      return {
        message:
          'If your registered email is valid, you will receive an email shortly.',
      };
    },
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
