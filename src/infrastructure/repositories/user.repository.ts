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
  // User methods
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
  async findAppUserById(id: string): Promise<IAppUser | null> {
    return await AppUser.findById(id);
  },

  async findAppUserByEmail(email: string): Promise<IAppUser | null> {
    return await AppUser.findOne({ email });
  },

  async findAppUserByUsername(username: string): Promise<IAppUser | null> {
    return await AppUser.findOne({ username });
  },

  async createAppUser(userData: CreateAppUserData): Promise<IAppUser> {
    const newAppUser = new AppUser(userData);
    return await newAppUser.save();
  },

  async deleteAppUserById(id: string): Promise<IAppUser | null> {
    return await AppUser.findByIdAndDelete(id);
  },

  async deleteAppUserByEmail(email: string): Promise<IAppUser | null> {
    return await AppUser.findOneAndDelete({ email });
  },

  async usernameExistsInAppUsers(username: string): Promise<boolean> {
    const user = await AppUser.findOne({ username });
    return !!user;
  },

  async emailExistsInAppUsers(email: string): Promise<boolean> {
    const user = await AppUser.findOne({ email });
    return !!user;
  },

  async updateAllowPushNotifications(userId: string, allowPushNotifications: boolean): Promise<IAppUser | null> {
    return await AppUser.findByIdAndUpdate(
      userId,
      { allowPushNotifications },
      { new: true }
    );
  }
};


