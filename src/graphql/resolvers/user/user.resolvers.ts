import {MAIL_USER, SERVER_DOMAIN} from 'src/config/environment';
import {mailingQueue} from 'src/jobs/queues/mailing.queue';
import renderTemplate from 'src/services/renderTemplate.service';
import {ulid} from 'ulid';

import {Resolvers} from '../../models/resolvers-types.model';

const UserResolvers: Resolvers = {
  User: {
    __resolveReference: async (parent, {dataSources}) => {
      const {user} = dataSources;
      const usersData = await user.listUsers({
        filter: {
          id: [parent.id],
        },
      });
      return usersData[0];
    },
    authorization: async (parent, _, {req, dataSources}) => {
      const {auth} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;

      const {data} = await auth.verifyAccessToken(accessToken);

      const userPermission = await auth.getUserAuthorization(data.id);

      return userPermission;
    },
  },
  Query: {
    getUser: async (_, {id}, {req, dataSources}) => {
      const {auth} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;

      const {getUserById} = dataSources.user;
      const usersData = await getUserById(id);

      await auth.isAuthorizedUser(
        accessToken,
        {modelName: 'users', permission: 'read'},
        usersData.id
      );

      return usersData;
    },
    listUsers: async (_, {input}, {req, dataSources}) => {
      const {auth, user} = dataSources;

      const accessToken = req.cookies.ACCESS_TOKEN;

      await auth.isAuthorizedUser(accessToken, {
        modelName: 'users',
        permission: 'list',
      });

      const usersData = await user.listUsers(input);
      return usersData;
    },
  },
  Mutation: {
    invalidateUserToken: async (_, {userId}, {req, dataSources}) => {
      const {user, auth} = dataSources;

      const accessToken = req.cookies.ACCESS_TOKEN;

      await auth.isAuthorizedUser(accessToken, {
        modelName: 'users',
        permission: 'update',
      });

      const responseResult = await user.invalidateUserToken(userId);
      return responseResult;
    },
    createUser: async (_, {input}, {req, dataSources}) => {
      const {auth, user} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;

      await auth.isAuthorizedUser(accessToken, {
        modelName: 'users',
        permission: 'create',
      });

      const newUserResult = await user.createUser(input);

      await mailingQueue.add(
        {
          html: renderTemplate('views/activate-user-account.hbs', {
            baseUrl: SERVER_DOMAIN,
            verificationId: newUserResult.verificationId,
            email: newUserResult.email,
          }),
          from: MAIL_USER,
          to: input.email,
          subject: 'Sending FROM nodemailer',
        },
        {
          jobId: ulid(),
          delay: 5000, // 1 min in ms
          attempts: 2,
        }
      );

      return newUserResult;
    },
    updateUser: async (_, {input}, {req, dataSources}) => {
      const {auth, user} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;

      await auth.isAuthorizedUser(accessToken, {
        modelName: 'users',
        permission: 'update',
      });

      const updateResult = await user.updateUser(input);
      return updateResult;
    },
    forgotPassword: async (_, {email}, {dataSources}) => {
      const {user} = dataSources;
      const responseResult = await user.forgotUserPassword(email);
      return responseResult;
    },
    resetPassword: async (_, {input}, {dataSources}) => {
      const {user} = dataSources;
      const responseResult = await user.resetUserPassword(input);
      return responseResult;
    },
  },
};

export default UserResolvers;
