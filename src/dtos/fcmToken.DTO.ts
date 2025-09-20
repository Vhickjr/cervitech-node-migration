// viewModels/FCMTokenUpdateViewModel.ts

export interface FCMTokenUpdateViewModel {
  _id: string;
  fcmToken: string;
}

export interface FCMData {
  title: string;
  body: string;
  sound?: string; // optional, based on usage
}

export interface FCMPushNotificationDTO {
  to: string;
  notification: FCMData;
  data: FCMData;
  priority: 'high' | 'normal'; // restrict to valid values
}
