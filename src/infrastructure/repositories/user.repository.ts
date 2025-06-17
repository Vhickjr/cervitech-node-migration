// src/infrastructure/repositories/user.repository.ts
import { User } from '../../domain/user.entity';
import mongoose from 'mongoose';

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
  }
};


