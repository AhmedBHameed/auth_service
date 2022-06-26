import {Document, model, Schema} from 'mongoose';

import {User} from '../../../graphql/models';
import {getUTCTime} from '../../../util';

export interface IUserModel
  extends Omit<User & {verificationId: string}, 'id'>,
    Document {}

const UserSchema = new Schema(
  {
    id: {type: String, required: true, unique: true},
    name: {type: {first: String, last: String}, default: null},
    email: {type: String, required: true, unique: true},
    passwordSalt: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, default: ''},
    isActive: {
      type: Boolean,
      default: false,
      required: true,
    },
    isSuper: {
      type: Boolean,
      default: false,
      required: true,
    },
    socialMediaId: {type: String, default: ''},
    githubUrl: {type: String, default: ''},
    gender: {type: String, default: ''},
    verificationId: {type: String, default: ''},
    authorizationId: {type: String, required: true},
    attemptOfResetPassword: {type: Number, default: 0},
    address: {
      type: {
        state: {type: String, default: null},
        city: {type: String, default: null},
        street: {type: String, default: null},
        subdivision: {type: String, default: null},
        lane: {type: String, default: null},
        house: {type: String, default: null},
        zip: {type: String, default: null},
      },
      default: null,
    },
    occupation: {type: String, default: ''},
    about: {type: String, default: ''},
  },
  {timestamps: true}
);

UserSchema.pre<IUserModel>('save', function init(this, next) {
  const utc = getUTCTime(new Date());
  if (!this.createdAt) {
    this.createdAt = utc;
  }
  this.updatedAt = utc;
  next();
});

const UserDbModel = model<IUserModel>('User', UserSchema);
export default UserDbModel;
