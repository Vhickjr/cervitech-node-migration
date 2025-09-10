export interface AppUserViewModel {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  pictureUrl?: string;
  fcmToken?: string;
  allowPushNotifications: boolean;
  hasPaid: boolean;
  mobileChannel?: string;
  isGoalOn: boolean;
  dateRegistered: string;
  responseRate?: number;
  lastLoginDateTime?: Date;
  prompt?: string;
  notificationCount?: number;
  salt?: string;
  hash?: string;
}