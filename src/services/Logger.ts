import winston from 'winston';
// eslint-disable-next-line
import Transport from 'winston-transport';

import environment from '../config/environment';

export type Logger = winston.Logger;

const transports: Transport[] = [
  new winston.transports.File({
    level: environment.logs.level,
    filename: `${environment.logs.dir}/app.log`,
    handleExceptions: true,
    maxsize: 1000000, // 1MB
    maxFiles: 5,
  }),
];

if (environment.isProd) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    })
  );
} else {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: environment.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: transports,
});

export default logger;

// @injectable()
// export default class LoggerLocator {
//   private _transports: Transport[] = [
//     new winston.transports.File({
//       level: environment.logs.level,
//       filename: `${environment.logs.dir}/app.log`,
//       handleExceptions: true,
//       maxsize: 1000000, // 1MB
//       maxFiles: 5,
//     }),
//   ];
//   public log!: winston.Logger;

//   constructor() {
//     this._init();
//   }

//   private _init() {
//     if (environment.nodeEnv !== 'development') {
//       this._transports.push(new winston.transports.Console());
//     } else {
//       this._transports.push(
//         new winston.transports.Console({
//           format: winston.format.combine(winston.format.cli(), winston.format.splat()),
//         })
//       );
//     }

//     this.log = winston.createLogger({
//       level: environment.logs.level,
//       levels: winston.config.npm.levels,
//       format: winston.format.combine(
//         winston.format.timestamp({
//           format: 'YYYY-MM-DD HH:mm:ss',
//         }),
//         winston.format.errors({stack: true}),
//         winston.format.splat(),
//         winston.format.json()
//       ),
//       transports: this._transports,
//     });
//   }
// }
