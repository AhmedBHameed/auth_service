const {BUILD_ENV, MONGODB_PASS, VERSION, SECRET} = process.env;

const isProd = BUILD_ENV === 'prod';

export default {
  version: VERSION,
  isProd: isProd,
  database: {
    dbName: 'admin',
    password: MONGODB_PASS || '',
    port: 27017,
    server: 'mango',
    user: 'super',
  },
  logs: {
    dir: 'logs',
    level: isProd ? 'error' : 'debug',
  },
  port: '5001',
  secret: SECRET || '',
};
