import { User } from './user.types';

/* export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  token: string;
} */

export interface MininmalUser {
  _id: string;
  email: string;
}

export interface LoginRequest{
  emailOrUsername: string;
  password: string;
  mobileChannel: number;
}

export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  hasPaid: boolean;
  pictureUrl: string;
  fcmToken: string;
  isGoalOn: boolean;
  allowPushNotifications: boolean;
  mobileChannel: number;
  currentTargetedAverageNeckAngle: number;
  dateRegistered: string;
  responseRate: number;
  lastLoginDateTime: Date;
  prompt: string;
  notificationCount: number;
  token: string; 
}

export interface LoginViewModel {
  emailOrUsername: string;
  password: string;
  mobileChannel: string;
}

export interface AppUserViewModel {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  hasPaid: boolean;
  pictureUrl?: string;
  fcmToken?: string;
  isGoalOn: boolean;
  allowPushNotifications: boolean;
  mobileChannel: number;
  currentTargetedAverageNeckAngle: number;
  dateRegistered: string;
  responseRate?: number;
  lastLoginDateTime?: Date;
  prompt?: string;
  notificationCount?: number;
}