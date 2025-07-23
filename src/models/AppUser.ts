import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { MOBILE_CHANNEL } from '../enums/mobileChannel';
import { NeckAngleRecordSchema, INeckAngleRecord } from './NeckAngleRecord';
import { GoalSchema, IGoal } from './Goal';

export interface IAppUser extends IUser {
  fcmToken: string;
  username: string;
  lastLoginDateTime: Date;
  allowPushNotifications: boolean;
  hasPaid: boolean;
  isGoalOn: boolean;
  responseRate: number;
  neckAngleRecords: INeckAngleRecord[];
  goals: IGoal[];
  mobileChannel: MOBILE_CHANNEL;
  prompt?: number;
  notificationCount?: number;
}

const AppUserSchema: Schema = new Schema<IAppUser>({
  // Base User fields
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: false },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  pictureUrl: { type: String, required: false },
  dateRegistered: { type: Date, required: true, default: Date.now },
  
  // AppUser specific fields
  fcmToken: { type: String },
  username: { type: String, required: true, unique: true },
  lastLoginDateTime: { type: Date, default: Date.now },
  allowPushNotifications: { type: Boolean, default: true },
  hasPaid: { type: Boolean, default: false },
  isGoalOn: { type: Boolean, default: false },
  responseRate: { type: Number, default: 0 },

  neckAngleRecords: {
    type: [NeckAngleRecordSchema],
    default: [],
  },

  goals: {
    type: [GoalSchema],
    default: [],
  },

  mobileChannel: {
    type: String,
    enum: Object.values(MOBILE_CHANNEL),
    default: MOBILE_CHANNEL.OTHER,
  },
  prompt: { type: Number, required: false },
  notificationCount: { type: Number, required: false },
});

const AppUser = mongoose.model<IAppUser>('AppUser', AppUserSchema);
export default AppUser;
