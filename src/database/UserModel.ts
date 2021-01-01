import {Document, model, Schema, Types} from 'mongoose';
import {utcTime} from 'src/util/time';

export interface UserAddress {
  state?: string | null;
  city?: string | null;
  street?: string | null;
  subdivision?: string | null;
  lane?: string | null;
  house?: string | null;
  zip?: string | null;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IUser {
  name?: {
    first: string;
    last: string;
  };
  email: string;
  passwordSalt: string;
  password: string;
  avatar?: string;
  status: UserStatus;
  gender?: string;
  roles: string[];
  verificationId?: string;
  attemptOfResetPassword: number;
  address?: UserAddress;
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema(
  {
    id: {type: Types.ObjectId},
    name: {type: {first: String, last: String}, default: null},
    email: {type: String, required: true, unique: true},
    passwordSalt: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, default: ''},
    status: {
      type: String,
      enum: [UserStatus.ACTIVE, UserStatus.INACTIVE],
      default: UserStatus.INACTIVE,
      required: true,
    },
    gender: {type: String, default: ''},
    roles: [{type: String, default: []}],
    verificationId: {type: String, default: ''},
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
  },
  {timestamps: true}
);

UserSchema.pre<IUserModel>('save', function (this, next) {
  const utc = utcTime().valueOf().toString();
  if (!this['createdAt']) {
    this['createdAt'] = utc;
  }
  this['updatedAt'] = utc;
  next();
});

const UserModel = model<IUserModel>('User', UserSchema);
export default UserModel;
