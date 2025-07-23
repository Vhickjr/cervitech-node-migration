// src/infrastructure/repositories/user.repository.ts
import { User } from '../../dtos/user.entity';
import mongoose from 'mongoose';
import AppUser, { IAppUser } from '../../models/AppUser';
import { MOBILE_CHANNEL } from '../../enums/mobileChannel';

const userSchema = new mongoose.Schema<User>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['app_user', 'backoffice_user'], default: 'app_user' }
}, { timestamps: true });

const UserModel = mongoose.model<User>('User', userSchema);

interface CreateAppUserData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  hash: string;
  salt: string;
  fcmToken?: string;
  mobileChannel: MOBILE_CHANNEL;
}

export const UserRepository = {
  // Basic User methods
  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  },
  async create(user: User) {
    return await UserModel.create(user);
  },
  async updatePassword(userId: string, newPassword: string) {
    return await UserModel.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
  },

  // AppUser methods
  async createAppUser(userData: CreateAppUserData): Promise<IAppUser> {
    const appUser = new AppUser({
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      hash: userData.hash,
      salt: userData.salt,
      fcmToken: userData.fcmToken || '',
      mobileChannel: userData.mobileChannel,
      allowPushNotifications: true,
      hasPaid: false,
      isGoalOn: false,
      responseRate: 0,
      lastLoginDateTime: new Date(),
      dateRegistered: new Date(),
      neckAngleRecords: [],
      goals: [],
      prompt: parseInt(process.env.ENV_DEFAULT_PROMPT || '5'),
      notificationCount: 0
    });

    const savedUser = await appUser.save();
    return savedUser;
  },

  async findAppUserById(userId: string): Promise<IAppUser | null> {
    return await AppUser.findById(userId);
  },

  async findAppUserByEmail(email: string): Promise<IAppUser | null> {
    return await AppUser.findOne({ email });
  },

  async findAppUserByUsername(username: string): Promise<IAppUser | null> {
    return await AppUser.findOne({ username });
  },

  async updateAllowPushNotifications(userId: string, allow: boolean): Promise<IAppUser | null> {
    return await AppUser.findByIdAndUpdate(userId, { allowPushNotifications: allow }, { new: true });
  },

  async emailExistsInAppUsers(email: string): Promise<boolean> {
    const user = await AppUser.findOne({ email });
    return !!user;
  },

  async usernameExistsInAppUsers(username: string): Promise<boolean> {
    const user = await AppUser.findOne({ username });
    return !!user;
  }
};


