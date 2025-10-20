import axios from 'axios';
import { ApplicationConstant } from '../utils/applicationConstants';
import { PushNotificationModelDTO } from '../types/pushNotificationModel.types';
import { FCMPushNotificationDTO } from '../types/FCMPushNotification.types';
import AppUser from '../models/AppUser';
import { logger } from '../utils/logger';
import serviceAccount from '../../serviceAccountKey.json';
import jwt from 'jsonwebtoken';

export class PushNotificationDriver {
  static readonly FCMApiUrl: string = process.env.FCM_API_URL || 'https://fcm.googleapis.com'; // legacy base (fallback only)
  static readonly FCMServerKey: string = process.env.FCM_SERVER_KEY || ''; // legacy (fallback only)

  // HTTP v1 settings from service account
  private static accessToken: string | null = null;
  private static accessTokenExpiryEpoch: number = 0; // seconds since epoch

  private static async getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    // Reuse token if still valid for > 60s
    if (this.accessToken && now < this.accessTokenExpiryEpoch - 60) {
      return this.accessToken;
    }

    const clientEmail = (serviceAccount as any).client_email as string;
    const privateKey = (serviceAccount as any).private_key as string;
    const tokenUri = (serviceAccount as any).token_uri as string;

    const iat = now;
    const exp = now + 3600; // 1 hour
    const payload = {
      iss: clientEmail,
      sub: clientEmail,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: tokenUri,
      iat,
      exp,
    } as jwt.JwtPayload;

    const assertion = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    const form = new URLSearchParams();
    form.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    form.append('assertion', assertion);

    const { data } = await axios.post(tokenUri, form.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    this.accessToken = data.access_token;
    this.accessTokenExpiryEpoch = now + (data.expires_in || 3600);
    return this.accessToken as string;
  }

  private static async sendHttpV1(model: PushNotificationModelDTO): Promise<boolean> {
    const projectId = (serviceAccount as any).project_id as string;
    const accessToken = await this.getAccessToken();

    const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
    const body = {
      message: {
        token: model.to,
        notification: {
          title: model.title,
          body: model.body,
        },
        data: {
          title: model.title,
          body: model.body,
        },
      },
    };

    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    logger.info(`FCM v1 response: ${response.status} ${response.statusText}`);
    try {
      logger.info(`FCM v1 body: ${JSON.stringify(response.data)}`);
    } catch {}
    return true;
  }

  static async sendPushNotification(model: PushNotificationModelDTO): Promise<boolean> {
    try {
      // Check if user allows push notifications using Mongoose
      const user = await AppUser.findOne({ fcmToken: model.to });
      if (user && !user.allowPushNotifications) {
        return true;
      }

      // Prefer HTTP v1; fall back to legacy only if explicitly configured
      try {
        return await this.sendHttpV1(model);
      } catch (v1Error: any) {
        logger.error(`FCM v1 failed: ${v1Error?.message || 'unknown error'}`);
        if (!this.FCMServerKey) {
          throw v1Error;
        }

        // Legacy fallback if server key provided
        const senderId = 'legacy';
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

        const legacyResp = await axios.post(`${PushNotificationDriver.FCMApiUrl}/fcm/send`, pushNotificationDTO, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${PushNotificationDriver.FCMServerKey}`,
            'Sender': `id=${senderId}`,
          },
        });
        logger.info(`FCM legacy response: ${legacyResp.status} ${legacyResp.statusText}`);
        try {
          logger.info(`FCM legacy body: ${JSON.stringify(legacyResp.data)}`);
        } catch {}
        return true;
      }
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }
}
