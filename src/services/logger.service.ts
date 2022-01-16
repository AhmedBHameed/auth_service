import winston from 'winston';
import Transport from 'winston-transport';

import {
  IS_PRODUCTION,
  WINSTON_LOG_DIR,
  WINSTON_LOG_LEVEL,
} from '../config/environment';

export type Logger = winston.Logger;

const transports: Transport[] = [
  new winston.transports.File({
    level: WINSTON_LOG_LEVEL,
    filename: `${WINSTON_LOG_DIR}/app.log`,
    handleExceptions: true,
    maxsize: 1000000, // 1MB
    maxFiles: 5,
  }),

  !IS_PRODUCTION
    ? new winston.transports.Console()
    : new winston.transports.Console({
        format: winston.format.combine(
          winston.format.cli(),
          winston.format.splat()
        ),
      }),
];

const logger = winston.createLogger({
  level: WINSTON_LOG_LEVEL,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({stack: !IS_PRODUCTION}),
    winston.format.splat(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports,
});

const initLogger = (): void => {
  process
    .on('unhandledRejection', (reason) => {
      if (reason) {
        logger.error('', reason, () => {
          throw reason;
        });
      }
    })
    .on('uncaughtException', (error) => {
      logger.error('', error, () => {
        throw error;
      });
    });
};

export {initLogger, logger};
