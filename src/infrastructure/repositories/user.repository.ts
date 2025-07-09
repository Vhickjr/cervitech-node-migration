// src/infrastructure/repositories/user.repository.ts
import { User } from '../../dtos/user.entity';
import mongoose from 'mongoose';
import AppUser, { IAppUser } from '../../models/AppUser';

const userSchema = new mongoose.Schema<User>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['app_user', 'backoffice_user'], default: 'app_user' }
}, { timestamps: true });

const UserModel = mongoose.model<User>('User', userSchema);

export const UserRepository = {
  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  },
  async create(user: User) {
    return await UserModel.create(user);
  },
  async updatePassword(userId: string, newPassword: string) {
    return await UserModel.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
  },
  async updateAllowPushNotifications(userId: string, allow: boolean): Promise<IAppUser | null> {
    return await AppUser.findByIdAndUpdate(userId, { allowPushNotifications: allow }, { new: true });
  },
  async findAppUserById(userId: string): Promise<IAppUser | null> {
    return await AppUser.findById(userId);
  }
};


