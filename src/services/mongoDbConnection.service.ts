import bluebird from 'bluebird';
import {connect, Mongoose} from 'mongoose';
import {callTryCatch} from 'src/util';

import {
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_SERVER,
  DB_USER_NAME,
} from '../config/environment';
import {logger} from './logger.service';

bluebird.promisifyAll(Mongoose);

// set("useCreateIndex", true);
// set("useNewUrlParser", true);
// set('toObject', {
//   virtuals: true,
//   versionKey: false,
//   transform: (_: any, ret: any) => {
//     ret.id = ret._id?.toString();
//     delete ret._id;
//     delete ret.__v;
//   },
// });
// set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: (_: any, ret: any) => {
//     ret.id = ret._id.toString();
//     delete ret._id;
//     delete ret.__v;
//   },
// });

/**
 * Connection ready state
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 * Each state change emits its associated event name.
 */
const initDbConnection = async () => {
  const connectionResult = await callTryCatch<Mongoose, Error>(() =>
    connect(
      `mongodb://${DB_USER_NAME}:${DB_PASS}@${DB_SERVER}:${DB_PORT}/${DB_NAME}?ssl=false`
    )
  );

  if (connectionResult instanceof Error) {
    logger.error('🔥 Database connection failed: %o', connectionResult);
    return -1;
  }
  return connectionResult.connection.readyState;
};

export default initDbConnection;
