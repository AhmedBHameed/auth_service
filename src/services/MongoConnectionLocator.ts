import bluebird from 'bluebird';
import {inject, injectable} from 'inversify';
import {connect, Mongoose, set} from 'mongoose';
import TYPES from 'src/models/DI/types';
import {Logger} from 'winston';

import environment from '../config/environment';

@injectable()
class MongoConnectionLocator {
  @inject(TYPES.Logger)
  private _logger!: Logger;

  private _init() {
    bluebird.promisifyAll(Mongoose);
    set('useCreateIndex', true);
    set('useNewUrlParser', true);
    set('toObject', {
      virtuals: true,
      versionKey: false,
      transform: (_: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    });
    set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (_: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    });
  }

  /**
   * Connection ready state
   * 0 = disconnected
   * 1 = connected
   * 2 = connecting
   * 3 = disconnecting
   * Each state change emits its associated event name.
   */
  public async connect(): Promise<number> {
    this._init();
    try {
      const {dbName, password, port, server, user} = environment.database;
      const connection = await connect(`mongodb://${server}:${port}/${dbName}`, {
        user: user,
        pass: password,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      return connection.connection.readyState;
    } catch (error) {
      this._logger.error('🔥 Database connection failed: %o', error);
      return -1;
    }
  }
}

export default MongoConnectionLocator;
