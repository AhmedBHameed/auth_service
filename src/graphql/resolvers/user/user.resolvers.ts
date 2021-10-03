import environment from 'src/config/environment';
import {mailingQueue} from 'src/jobs/queues/mailing.queue';
import {ulid} from 'ulid';

import {Resolvers} from '../../models/resolvers-types.model';

const {MAIL_USER} = environment;

const UserResolvers: Resolvers = {
  Query: {
    getUser: async (_, {id}, {req, dataSources}) => {
      const {authentication, authorization} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;
      const payload = await authentication.verifyAccessToken(accessToken || '');

      const {getUserById} = dataSources.user;
      const usersData = await getUserById(id);

      await authorization.isAuthorizedUser(
        {modelName: 'users', permission: 'read'},
        payload.data,
        usersData.id
      );

      return usersData;
    },
    listUsers: async (_, {input}, {req, dataSources}) => {
      const {authorization, authentication, user} = dataSources;

      const accessToken = req.cookies.ACCESS_TOKEN;
      const payload = await authentication.verifyAccessToken(accessToken || '');

      await authorization.isAuthorizedUser(
        {modelName: 'users', permission: 'list'},
        payload.data
      );

      const usersData = await user.listUsers(input);
      return usersData;
    },
  },
  Mutation: {
    createUser: async (_, {input}, {req, dataSources}) => {
      const {authentication, authorization, user} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;
      const payload = await authentication.verifyAccessToken(accessToken || '');

      await authorization.isAuthorizedUser(
        {modelName: 'users', permission: 'create'},
        payload.data
      );

      const newUserResult = await user.createUser(input);

      await mailingQueue.add(
        {
          html: `<h1>Testing email</h1>`,
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
      const {authentication, authorization, user} = dataSources;
      const accessToken = req.cookies.ACCESS_TOKEN;
      const payload = await authentication.verifyAccessToken(accessToken || '');

      await authorization.isAuthorizedUser(
        {modelName: 'users', permission: 'update'},
        payload.data
      );

      const updateResult = await user.updateUser(input);

      await mailingQueue.add(
        {
          html: `
            <h1>Your user has been updated successfully</h1>`,
          from: MAIL_USER,
          to: updateResult.email,
          subject: 'ahmedhameed.dev - User updated',
        },
        {
          jobId: ulid(),
          delay: 5000,
          attempts: 2,
        }
      );

      return updateResult;
    },
  },
};

export default UserResolvers;
