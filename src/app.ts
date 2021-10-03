import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import environment from 'src/config/environment';
import xss from 'src/middleware/cleanXss.middleware';
import {initLogger} from 'src/services/logger.service';
import logWelcome from 'src/util/logWelcome';

import changelogController from './Controller/changelog.controller';
import apolloServer from './graphql/apolloServer.graphql';
import initDbConnection from './services/mongoDbConnection.service';
import {client} from './services/prometheus.service';

const {SERVER_BASE_PATH, SERVER_PORT} = environment;

(async () => {
  initLogger();

  const connectionStatus = await initDbConnection();
  if (connectionStatus !== 1)
    throw new Error('🔥 Loaders are not ready! please check log file');

  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({contentSecurityPolicy: false}));
  app.use(xss());
  app.use(cookieParser());
  app.set('view engine', 'handlebars');
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: `${SERVER_BASE_PATH}/graphql`,
    cors: false,
  });
  app.get('/changelog', changelogController);

  app.use('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });

  // Checking server availability
  app.use('/', async (_, res) => {
    res.send({message: 'System is healthy'});
    res.end();
  });

  const httpServer = http.createServer(app);

  httpServer.listen(SERVER_PORT, logWelcome);
})();

export default {};
