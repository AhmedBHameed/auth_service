/* eslint-disable prefer-destructuring */
/**
 * !This file required to centralize the environment variables.
 * */
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * * Server basic configuration.
 * */
const NODE_ENV = process.env.NODE_ENV;
const APP_VERSION = process.env.npm_package_version;
const SERVER_PORT = process.env.SERVER_PORT || 5001;
const SERVER_DOMAIN = 'http://localhost:5000';
const SERVER_BASE_PATH = process.env.SERVER_BASE_PATH || '';
const SERVER_ALLOWED_ORIGIN =
  process.env.SERVER_ALLOWED_ORIGIN || 'http://localhost:5001';
const PASS_PHRASE = process.env.PASS_PHRASE || '';
const LOGO_SRC = `${
  IS_PRODUCTION ? 'http://wwww.rocketdevs.com' : 'http://localhost:5500'
}/blog/rocket_devs_logo.png`;

/**
 * Database configuration
 * */
const DB_USER_NAME = process.env.DB_USER_NAME;
const DB_PASS = process.env.DB_PASS;
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME;
const DB_SERVER = process.env.DB_SERVER || 'mongodb';

/**
 * Mail configuration
 * */
const MAIL_HOST = process.env.MAIL_HOST || '';
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const APP_NAME = 'Rocket-Devs';

/**
 * Redis configuration
 * */
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const REDIS_PASS = process.env.REDIS_PASS;

/**
 * * Winston configuration.
 * */
const WINSTON_LOG_DIR = process.env.WINSTON_LOG_DIR || 'logs';
const WINSTON_LOG_LEVEL = IS_PRODUCTION ? 'error' : 'debug';

/**
 * Base API
 * */
const BASE_API = IS_PRODUCTION ? '' : 'http://localhost';

/**
 * Github credentials
 */
const GITHUB_CLIENT_ID = process.env.GH_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GH_CLIENT_SECRET;

console.log("===>>", DB_PASS)

export {
  APP_NAME,
  APP_VERSION,
  BASE_API,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_SERVER,
  DB_USER_NAME,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  IS_PRODUCTION,
  LOGO_SRC,
  MAIL_HOST,
  MAIL_PASS,
  MAIL_PORT,
  MAIL_USER,
  NODE_ENV,
  PASS_PHRASE,
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT,
  SERVER_ALLOWED_ORIGIN,
  SERVER_BASE_PATH,
  SERVER_DOMAIN,
  SERVER_PORT,
  WINSTON_LOG_DIR,
  WINSTON_LOG_LEVEL,
};
