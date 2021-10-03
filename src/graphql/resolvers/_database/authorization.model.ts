import {Document, model, Schema} from 'mongoose';
import {Authorization} from 'src/graphql/models';
import {getUTCTime} from 'src/util';

export interface IAuthorizationModel
  extends Omit<Authorization, 'id'>,
    Document {}

const AuthorizationModel = new Schema(
  {
    id: {type: String, required: true, unique: true},
    userId: {type: String, required: true, unique: true},
    actions: [
      {
        name: {type: String, required: true},
        permissions: {type: [String], required: true},
      },
    ],
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
