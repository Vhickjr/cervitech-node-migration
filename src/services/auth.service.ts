// MAIN BUSINESS LOGIC
// src/services/auth.service.ts
// import { UserRepository } from '../infrastructure/repositories/user.repository';
import { HashUtil } from '../utils/hash';
import { SignupRequest, SignupResponse, passwordResetRequest, passwordResetResponse } from '../viewmodels/auth.viewmodel';
import { TokenUtil } from '../utils/token.util';
import { LoginResponse, LoginRequest } from '../dtos/auth.entity';
// import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken';
import User from '../models/User';
import CustomException from "../helpers/CustomException";
import Goal from "../models/Goal";


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

  static async authenticate(model: LoginRequest): Promise<LoginResponse>{
    const { emailOrUsername, password, mobileChannel } = model;
    if(mobileChannel !== 1 && mobileChannel !== 2){
        throw new CustomException("Please make sure you pass a valid MobileChannel value for this user");
    }
    if(!emailOrUsername){
      throw new CustomException("Please provide an email or username");
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if(!user){
      throw new CustomException("This account does not exist. Please check the email or username provided.")
    }

    const isValidPassword = await HashUtil.compare(password, user.password);
    if (!isValidPassword) {
      throw new CustomException("An incorrect password provided. Please check password and try again.");
    }

    user.lastLoginDateTime = new Date();
    user.mobileChannel = mobileChannel;
    await user.save();

    const token = generateToken(user);

    let currentTargetedAverageNeckAngle = 0;
    const lastSetGoal = await Goal.findOne({ appUserId: user._id });
    if (lastSetGoal) {
      currentTargetedAverageNeckAngle = lastSetGoal.targetedAverageNeckAngle;
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hasPaid: user.hasPaid,
      pictureUrl: user.pictureUrl,
      fcmToken: user.fcmToken,
      isGoalOn: user.isGoalOn,
      allowPushNotifications: user.allowPushNotifications,
      mobileChannel: user.mobileChannel,
      currentTargetedAverageNeckAngle,
      dateRegistered: user.dateRegistered?.toISOString(),
      responseRate: user.responseRate,
      lastLoginDateTime: user.lastLoginDateTime || new Date(),
      prompt: user.prompt,
      notificationCount: user.notificationCount,
      token,
    };
    
  }

}
