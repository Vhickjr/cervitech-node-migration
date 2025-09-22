import { HashUtil } from '../utils/hash';
import { SignupRequest, SignupResponse, passwordResetRequest, passwordResetResponse } from '../viewmodels/auth.viewmodel';
import { TokenUtil } from '../utils/token.util';
import { LoginResponse, LoginRequest } from '../types/auth.types';
import { generateToken } from '../utils/generateToken';
import User from '../models/User';
import TokenBlacklist from '../models/TokenBlacklist';

import AppUser from '../models/AppUser';
import { LoginViewModel, AppUserViewModel } from '../types/auth.types';
import { CustomException } from '../helpers/customException';
import { Goal } from '../models/Goal';
import { logger } from '../utils/logger';
import { DateLibrary } from '../helpers/dateLibrary';


export class AuthService {
  static async signup(data: SignupRequest): Promise<SignupResponse> {
    console.log("Data", data)
    const existing = await AppUser.findOne({ email: data.email });
    if (existing) throw new Error('Email already in use');

    const hashedPassword = await HashUtil.hash(data.password);

    const createdUser = await User.create({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      username: data.username, // assuming this is part of SignupRequest
      pictureUrl: data.pictureUrl || '', // optional fallback
      fcmToken: data.fcmToken || '',
      lastLoginDateTime: new Date(),
      allowPushNotifications: true,
      hasPaid: false,
      isGoalOn: false,
      responseRate: 0,
      neckAngleRecords: [],
      goals: [],
      mobileChannel: data.mobileChannel || 'OTHER',
      prompt: 0,
      notificationCount: 0,
      currentTargetedAverageNeckAngle: 0,
      dateRegistered: new Date(),
    });

    const userObj = createdUser.toObject();
    delete userObj.password;

    return {
      message: 'Signup successful',
      data: userObj,
    };
  }
  static async sendPasswordResetToken({ email }: passwordResetRequest) {
    const user = await AppUser.findOne({ email });
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
    await AppUser.findByIdAndUpdate(userId, { password: hashed });
    return { message: 'Password reset successfully' };
  }

  static async authenticatev1(model: LoginRequest): Promise<LoginResponse>{
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

  static async logout(userId: string, token: string): Promise<boolean> {
    if (!userId) throw new CustomException("UserId is not provided");
    if (!token) throw new CustomException("Token is missing");

    const user = await User.findById(userId);
    if (!user) throw new CustomException("User not found");

    try {
      
      await TokenBlacklist.create({
        token,
        expiresAt: new Date(Date.now() + 3600 * 1000),
      });

      //user.fcmToken = "";
      await user.save();

      return true;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      logger.error(`Logout failed: ${err.message}`);
      throw err;
    }
  }

  static async logoutv2(userId: string): Promise<boolean> {
    try {
        if (userId === "") {
            throw new Error("UserId is not provided");
        }
        console.log("Attempting logout for userId:", userId);

        const user = await AppUser.findById(userId).exec();
        if (!user) {
            throw new CustomException("This user cannot be retrieved at the moment, please contact support.");
        }
        console.log("User found:", user.email);
        user.fcmToken = "";
        await user.save();

        return true;
    } catch (error) {
        if (error instanceof CustomException) {
            logger.error(error.message);
            throw error;
        } else {
            logger.error("Unexpected error during logout", error);
            throw error;
        }
    }
}

  static async authenticate(model: LoginViewModel): Promise<AppUserViewModel> {
      try {
        if (!['ANDROID', 'IOS', 'OTHER'].includes(model.mobileChannel)) {
          throw new Error('Please make sure you pass a valid MobileChannel value for this user');
        }
  
        if (!model.emailOrUsername || model.emailOrUsername.trim() === '') {
          throw new CustomException('Please provide an email or username');
        }
  
        const identifier = model.emailOrUsername.trim();
        logger.info(`Authenticating user with identifier: ${identifier}`);
  
        const user = await AppUser.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    }).exec();
  
        if (!user) {
          throw new CustomException('This account does not exist. Please check the email or username provided.');
        }
        
        const isValidPassword = HashUtil.compare(model.password, user.password);
  
        if (!isValidPassword) {
          throw new CustomException('An incorrect password provided. Please check password and try again.');
        }
  
        user.lastLoginDateTime = DateLibrary.getCurrentDateTime();
        await user.save();
  
        const lastSetGoal = await Goal.findOne({ appUserId: user._id }).exec();
  
        const currentTargetedAverageNeckAngle = lastSetGoal?.targetedAverageNeckAngle ?? 0;
  
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          hasPaid: user.hasPaid,
          pictureUrl: user.pictureUrl,
          fcmToken: user.fcmToken,
          isGoalOn: user.isGoalOn,
          allowPushNotifications: user.allowPushNotifications,
          mobileChannel: user.mobileChannel,
          currentTargetedAverageNeckAngle,
          dateRegistered: user.dateRegistered,
          responseRate: user.responseRate,
          lastLoginDateTime: user.lastLoginDateTime,
          prompt: user.prompt,
          notificationCount: user.notificationCount
        };
      } catch (error) {
        if (error instanceof CustomException) {
          logger.error(error.message);
          throw error;
        }
  
        logger.error('Unexpected error during authentication:', error);
        throw new Error('Internal server error');
      }
    }
  
}
