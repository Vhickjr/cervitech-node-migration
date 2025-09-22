import axios from 'axios';
import { ApplicationConstant } from '../utils/applicationConstants';
import { PushNotificationModelDTO } from '../types/pushNotificationModel.types';
import { FCMPushNotificationDTO } from '../types/FCMPushNotification.types';
import AppUser from '../models/AppUser';
import { logger } from '../utils/logger';

export class PushNotificationDriver {
  static readonly FCMApiUrl: string = process.env.FCM_API_URL || 'https://fcm.googleapis.com';
  static readonly FCMServerKey: string = process.env.FCM_SERVER_KEY || '';

  static async sendPushNotification(model: PushNotificationModelDTO): Promise<boolean> {
    try {
      // Check if user allows push notifications using Mongoose
      const user = await AppUser.findOne({ fcmToken: model.to });

      if (user && !user.allowPushNotifications) {
        return true;
      }

      const senderId = 'xxx';
      const deviceId = model.to;

      const pushNotificationDTO: FCMPushNotificationDTO = {
        to: deviceId,
        priority: 'high',
        notification: {
          sound: 'default',
          title: model.title,
          body: model.body,
        },
        data: {
          sound: 'default',
          title: model.title,
          body: model.body,
        },
      };

      const response = await axios.post(`${PushNotificationDriver.FCMApiUrl}/fcm/send`, pushNotificationDTO, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${PushNotificationDriver.FCMServerKey}`,
          'Sender': `id=${senderId}`,
        },
      });

      return true;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }
}
