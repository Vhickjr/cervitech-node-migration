import { UserRepository } from '../infrastructure/repositories/user.repository';
import { HashUtil } from '../utils/hash.utils';
import { IAppUser } from '../models/AppUser';
import { MOBILE_CHANNEL } from '../enums/mobileChannel';
import generateToken from '../utils/generateToken';

class CustomException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomException';
  }
}

interface CreateAppUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fcmToken?: string;
  mobileChannel: number; // 1 = Android, 2 = iOS
}

interface LoginAppUserRequest {
  emailOrUsername: string;
  password: string;
  mobileChannel: number;
}

interface AppUserResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  allowPushNotifications: boolean;
  token?: string;
}

export class AppUserService {
  static async createAppUser(data: CreateAppUserRequest): Promise<AppUserResponse> {
    // Validation
    if (!this.isValidEmail(data.email)) {
      throw new CustomException('Please enter a valid email address.');
    }

    if (data.username.trim().length <= 2) {
      throw new CustomException('Minimum of 3 characters is required in your username.');
    }

    if (await UserRepository.usernameExistsInAppUsers(data.username.trim())) {
      throw new CustomException('A user with the same username already exists. Please choose another username.');
    }

    if (await UserRepository.emailExistsInAppUsers(data.email.trim())) {
      throw new CustomException('A user with the same email already exists. Please use another email.');
    }

    if (data.password !== data.confirmPassword) {
      throw new CustomException('Passwords must match');
    }

    if (data.mobileChannel !== 1 && data.mobileChannel !== 2) {
      throw new CustomException('Please make sure you pass a valid MobileChannel value for this user');
    }

    // Create user
    const salt = this.generateSalt();
    const hash = await HashUtil.hash(data.password);
    const mobileChannel = data.mobileChannel === 1 ? MOBILE_CHANNEL.ANDROID : MOBILE_CHANNEL.IOS;

    const appUser = await UserRepository.createAppUser({
      username: data.username.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      hash,
      salt,
      fcmToken: data.fcmToken || '',
      mobileChannel
    });

    return {
      id: (appUser._id as any).toString(),
      username: appUser.username,
      email: appUser.email,
      firstName: appUser.firstName,
      lastName: appUser.lastName,
      allowPushNotifications: appUser.allowPushNotifications
    };
  }

  static async authenticateAppUser(data: LoginAppUserRequest): Promise<AppUserResponse> {
    let user: IAppUser | null = null;

    if (this.isValidEmail(data.emailOrUsername)) {
      user = await UserRepository.findAppUserByEmail(data.emailOrUsername);
    } else {
      user = await UserRepository.findAppUserByUsername(data.emailOrUsername);
    }

    if (!user) {
      throw new CustomException('User not found');
    }

    if (!user.hash || user.hash.trim() === '') {
      throw new CustomException('User authentication data is corrupted. Please contact support.');
    }

    // Verify password
    const isValidPassword = await HashUtil.compare(data.password, user.hash);
    
    if (!isValidPassword) {
      throw new CustomException('Invalid password');
    }

    // Generate token
    const token = generateToken({ _id: (user._id as any).toString(), email: user.email });

    return {
      id: (user._id as any).toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      allowPushNotifications: user.allowPushNotifications,
      token
    };
  }

  static async toggleAllowPushNotifications(userId: string): Promise<boolean> {
    const user = await UserRepository.findAppUserById(userId);
    if (!user) {
      throw new CustomException('User not found');
    }
    
    const newStatus = !user.allowPushNotifications;
    await UserRepository.updateAllowPushNotifications(userId, newStatus);
    return newStatus;
  }

  // Utility methods
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static generateSalt(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
