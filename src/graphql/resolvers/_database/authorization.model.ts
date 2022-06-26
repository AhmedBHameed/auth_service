import {Document, model, Schema} from 'mongoose';

import {Authorization, UserAction} from '../../../graphql/models';
import {getUTCTime} from '../../../util';

export interface IAuthorizationModel
  extends Omit<Authorization & {actions: UserAction[]}, 'id'>,
    Document {}

const AuthorizationModel = new Schema(
  {
    id: {type: String, required: true, unique: true},
    userId: {type: String, required: true, unique: true},
    actions: {
      type: [
        {
          name: {type: String, required: true},
          permissions: {type: [String], required: true},
        },
      ],
      default: [],
    },
  },
  {timestamps: true}
);

AuthorizationModel.pre<IAuthorizationModel>('save', function init(this, next) {
  const utc = getUTCTime(new Date());
  if (!this.createdAt) {
    this.createdAt = utc;
  }
  this.updatedAt = utc;
  next();
});

const AuthorizationDbModel = model<IAuthorizationModel>(
  'Authorization',
  AuthorizationModel
);
export default AuthorizationDbModel;
