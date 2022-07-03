import {SendMailOptions} from 'nodemailer';
import {ulid} from 'ulid';

import {
  APP_NAME,
  LOGO_SRC,
  MAIL_USER,
  SERVER_DOMAIN,
} from '../../../config/environment';
import {mailingQueue} from '../../../jobs/queues/mailing.queue';
import renderTemplate from '../../../services/renderTemplate.service';
import {Resolvers} from '../../models/resolvers-types.model';

const querierAndMutatorVerifierFun = async (_, __, {req, dataSources}) => {
  const {
    auth: {verifyAccessToken, getUserAuthorization},
    user: {checkUserVerificationId},
  } = dataSources;
  const accessToken = req.cookies.ACCESS_TOKEN;
  const tokenPayload = await verifyAccessToken(accessToken || '');

  const {id, verificationId, isSuper} = tokenPayload;

  const userResult = await checkUserVerificationId(id, verificationId);
  const userAuthorization = await getUserAuthorization(id);

  return {
    id,
    verificationId,
    email: userResult.email,
    userActionsAsJson: JSON.stringify(userAuthorization.actions),
    isSuper,
  };
};

const AuthenticationResolvers: Resolvers = {
  VerifyToken: {
    actions: async ({actions}) => actions || [],
  },
  Query: {
    githubLogin: async (_, {code}, {dataSources}) => {
      const {auth} = dataSources;

      const accessToken = await auth.createGithubTokens(code);

      const data = await auth.verifyGithubAccessToken(accessToken);

      const tokens = await auth.createSocialMediaToken(data);

      // const s = await auth.create

      return tokens;
    },
    verifyMe: async (_, __, {req, dataSources}) => {
      const {auth, user} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;
      const tokenPayload = await auth.verifyAccessToken(accessToken || '');

      const {id} = tokenPayload;

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

      const tokenPayload = await auth.verifyAccessToken(accessToken);

      const userPermission = await auth.getUserAuthorization(tokenPayload.id);

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
            baseUrl: SERVER_DOMAIN,
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
    upsertAuthorization: async (_, {input}, {req, dataSources}) => {
      const {auth} = dataSources;

      const accessToken = req.cookies.ACCESS_TOKEN;

      await auth.isAuthorizedUser(accessToken, {
        modelName: 'authorizations',
        permission: 'update',
      });

      const userAuthorization = await auth.upsertAuthorization(input);
      return userAuthorization;
    },
  },
};

export default AuthenticationResolvers;
