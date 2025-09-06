import axios from 'axios';
import { ApplicationConstant } from '../utils/applicationConstants';
import { PushNotificationModelDTO } from '../dtos/PushNotificationModelDTO';
import { FCMPushNotificationDTO } from '../dtos/FCMPushNotificationDTO';
import AppUser from '../models/AppUser';
import { logger } from '../utils/logger';

export class PushNotificationDriver {
  private static FCMApiUrl: string = ApplicationConstant.ENV_FCM_API_URL;
  private static FCMServerKey: string = ApplicationConstant.ENV_FCM_SERVER_KEY;

  public static async sendPushNotification(model: PushNotificationModelDTO): Promise<boolean> {
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

      const response = await axios.post(`${this.FCMApiUrl}/fcm/send`, pushNotificationDTO, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${this.FCMServerKey}`,
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
