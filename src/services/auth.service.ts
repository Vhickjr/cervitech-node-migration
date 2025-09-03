// MAIN BUSINESS LOGIC
// src/services/auth.service.ts
// import { UserRepository } from '../infrastructure/repositories/user.repository';
import { HashUtil } from '../utils/hash';
import { SignupRequest, SignupResponse, passwordResetRequest, passwordResetResponse } from '../viewmodels/auth.viewmodel';
import { TokenUtil } from '../utils/token.util';
import { LoginResponse } from '../dtos/auth.entity';
// import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken';
import User from '../models/User';

export class AuthService {
  static async signup(data: SignupRequest): Promise<SignupResponse> {
    console.log("Data", data)
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error('Email already in use');

    const hashedPassword = await HashUtil.hash(data.password);
    const newUser = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });

    return {
      message: 'Signup successful',
      data: newUser,
    };
  }
  static async sendPasswordResetToken({ email }: passwordResetRequest) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const token = TokenUtil.generateResetToken(user._id.toString());

    return {
      message: 'Password link generated',
      resetLink: `http://localhost:4000/api/auth/reset-password?token=${token}`
    }


  }
  static async resetPassword({ token, newPassword }: passwordResetResponse) {
    const { userId } = TokenUtil.verifyResetToken(token);
    const hashed = await HashUtil.hash(newPassword);
    await User.findByIdAndUpdate(userId, { password: hashed });
    return { message: 'Password reset successfully' };
  }
  static async login(email: string, password: string): Promise<LoginResponse> {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error('User not found');

    const isValidPassword = await HashUtil.compare(password, user.password);
    if (!isValidPassword) throw new Error('Invalid password');

    const token: string = generateToken(user);

    return {
      id: user._id.toString(),
      username: user.name,
      email: user.email,
      token
    };
  }
}
