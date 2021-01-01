import 'reflect-metadata';

import bodyParser from 'body-parser';
import express from 'express';
import {Container} from 'inversify';
import environment from 'src/config/environment';
import UserDataController from 'src/Controller/UserDataController';
import TYPES from 'src/models/DI/types';
import {Logger} from 'src/services/Logger';
import MongoConnectionLocator from 'src/services/MongoConnectionLocator';
import {allowOriginAccess} from 'src/util/allow-origin-access';
import logWelcome from 'src/util/logWelcome';

import IOC from './inversionOfControl';

export default async (): Promise<void> => {
  const container: Container = IOC();

  const log = container.get<Logger>(TYPES.Logger);
  const mongoConnection = container.get<MongoConnectionLocator>(TYPES.MongoConnectionLocator);
  const userDataController = container.get<UserDataController>(TYPES.UserDataController);

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(allowOriginAccess());

  app.post('/api/generate-tokens', (req, res) => userDataController.GenerateToken(req, res));
  app.post('/api/verify-token', (req, res) => userDataController.VerifyToken(req, res));
  app.post('/api/refresh-tokens', (req, res) => userDataController.RefreshToken(req, res));

  app.post('/api/find-all-users', (req, res) => userDataController.FindAllUsers(req, res));
  app.post('/api/find-user-by-id', (req, res) => userDataController.FindUserById(req, res));
  app.post('/api/create-user', (req, res) => userDataController.CreateUser(req, res));
  app.post('/api/update-user', (req, res) => userDataController.UpdateUser(req, res));
  app.post('/api/delete-user', (req, res) => userDataController.DeleteUser(req, res));
  app.post('/api/verify-user', (req, res) => userDataController.VerifyUser(req, res));
  app.post('/api/forgot-password', (req, res) => userDataController.ForgotPassword(req, res));
  app.post('/api/reset-password', (req, res) => userDataController.ResetPassword(req, res));
  app.post('/api/search-users', (req, res) => userDataController.SearchUsers(req, res));

  process.on('unhandledRejection', reason =>
    log.error(`${reason}`, () => {
      throw reason;
    })
  );

  const readyState = await mongoConnection.connect();

  if (readyState !== 1) {
    throw new Error('🔥 Loaders are not ready! please check log file');
  }

  app.listen(environment.port, () => logWelcome());
};
