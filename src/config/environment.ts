import {isDockerized} from 'src/util/isDockerized';

const {
  PORT,
  // IS_APP_CONTAINERIZED,
  MONGODB_SERVER,
  MONGODB_SERVER_NO_CONTAINER,
  MONGODB_DB,
  MONGODB_PASS,
  MONGODB_PORT,
  MONGODB_USER,
  LOG_DIR,
  LOG_LEVEL,
  NODE_ENV,
  SECRET,
  VERSION,
} = process.env;

const serverHost = isDockerized() ? MONGODB_SERVER : MONGODB_SERVER_NO_CONTAINER;

export default {
  version: VERSION,
  isProd: NODE_ENV === 'production',
  database: {
    dbName: MONGODB_DB || '',
    password: MONGODB_PASS || '',
    port: parseInt(MONGODB_PORT || '27017', 10),
    server: serverHost,
    user: MONGODB_USER || '',
  },
  logs: {
    dir: LOG_DIR || 'logs',
    level: LOG_LEVEL || 'silly',
  },
  port: PORT || '5001',
  // redis: {
  //   host: get(process.env, 'REDIS_DOMAIN', '127.0.0.1'),
  //   pass: get(process.env, 'REDIS_PASSWORD', ''),
  //   port: parseInt(process.env.REDIS_PORT || '6379'),
  // },
  secret: SECRET || '',
};
