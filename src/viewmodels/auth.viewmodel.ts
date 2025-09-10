// src/viewmodels/auth.viewmodel.ts
export interface SignupRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  fcmToken: string;
  pictureUrl: string;
  hash: string;
  username: string;
  lastLoginDateTime: Date;
  salt: string;
  hasPaid: boolean;
  allowPushNotifications: boolean;
  responseRate: number;
  isGoalOn: boolean;
  goals: [];
  neckAngleRecords: [];
  prompt: number;
  mobileChannel: string;
  currentTargetedAverageNeckAngle: number;
  dateRegistered: Date;
  notificationResponse?: number;
  notificationCount?: number;
}

export interface SignupResponse {
  message: string;
  data: object;
}

export interface passwordResetRequest{
  email: string;
}

export interface passwordResetResponse{
  token: string;
  newPassword: string;
}

