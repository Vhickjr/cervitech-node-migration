import axios from 'axios';
import { PushNotificationModelDTO } from '../types/pushNotificationModel.types';
import AppUser from '../models/AppUser';
import { logger } from '../utils/logger';

// The app registers devices with Expo's push service (expo-notifications'
// getExpoPushTokenAsync — tokens look like "ExponentPushToken[xxxx]"), not
// raw FCM device tokens, and Google's legacy FCM HTTP endpoint this driver
// used to call (fcm.googleapis.com/fcm/send with a server key) was shut
// down in June 2024 regardless. Sending straight to Expo's push API is
// both the correct endpoint for the tokens this app actually collects and
// the simplest one — no Firebase service-account/OAuth setup needed.
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const EXPO_PUSH_RECEIPTS_URL = 'https://exp.host/--/api/v2/push/getReceipts';
const MAX_TOKENS_PER_REQUEST = 100; // Expo's own batching limit

interface ExpoTicket {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: { error?: string };
}

function isExpoPushToken(token: unknown): token is string {
  return typeof token === 'string' && token.startsWith('ExponentPushToken[');
}

async function clearInvalidToken(token: string) {
  try {
    await AppUser.updateMany({ fcmToken: token }, { $unset: { fcmToken: '' } });
  } catch (e: any) {
    logger.error(`Failed to clear invalid push token: ${e.message}`);
  }
}

export class PushNotificationDriver {
  /** Send to a single device. Kept for the existing /fcm/test-push and
   *  /fcm/test-scheduler dev endpoints and any other single-target caller. */
  static async sendPushNotification(model: PushNotificationModelDTO): Promise<boolean> {
    const results = await PushNotificationDriver.sendBatch([model]);
    return results[0] ?? false;
  }

  /**
   * Send up to many notifications in one go, chunked to Expo's 100-per-
   * request limit. Skips users who've opted out or don't have a valid
   * Expo token, and clears tokens Expo reports as no longer registered so
   * we stop retrying them.
   */
  static async sendBatch(models: PushNotificationModelDTO[]): Promise<boolean[]> {
    const results: boolean[] = new Array(models.length).fill(false);

    // Resolve opt-outs once per unique token instead of once per message.
    const uniqueTokens = [...new Set(models.map((m) => m.to))];
    const optedOut = new Set(
      (
        await AppUser.find({ fcmToken: { $in: uniqueTokens }, allowPushNotifications: false }).select('fcmToken')
      ).map((u) => u.fcmToken)
    );

    const sendableIndexes: number[] = [];
    const messages = models.map((model, i) => {
      if (!isExpoPushToken(model.to)) {
        logger.warn(`Skipping push: "${model.to}" is not a valid Expo push token.`);
        return null;
      }
      if (optedOut.has(model.to)) {
        results[i] = true; // not an error, the user just opted out
        return null;
      }
      sendableIndexes.push(i);
      return {
        to: model.to,
        sound: 'default',
        title: model.title,
        body: model.body,
        priority: 'high',
        data: model.data ?? {},
      };
    }).filter(Boolean) as any[];

    for (let start = 0; start < messages.length; start += MAX_TOKENS_PER_REQUEST) {
      const chunk = messages.slice(start, start + MAX_TOKENS_PER_REQUEST);
      const chunkIndexes = sendableIndexes.slice(start, start + MAX_TOKENS_PER_REQUEST);

      try {
        const response = await axios.post(EXPO_PUSH_URL, chunk, {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });
        const tickets: ExpoTicket[] = response.data?.data ?? [];

        for (let j = 0; j < tickets.length; j++) {
          const ticket = tickets[j];
          const modelIndex = chunkIndexes[j];
          if (ticket.status === 'ok') {
            results[modelIndex] = true;
          } else {
            logger.error(`Expo push error for token ${models[modelIndex].to}: ${ticket.message}`);
            if (ticket.details?.error === 'DeviceNotRegistered') {
              await clearInvalidToken(models[modelIndex].to);
            }
          }
        }
      } catch (error: any) {
        logger.error(`Expo push batch request failed: ${error.message}`);
      }
    }

    return results;
  }

  /** Optional: poll delivery receipts for tickets returned by sendBatch,
   *  useful if you want to distinguish "accepted by Expo" from "actually
   *  delivered". Not wired into anything yet — call this ~15+ min after
   *  sendBatch with the ticket ids you want to check. */
  static async getReceipts(ticketIds: string[]): Promise<Record<string, ExpoTicket>> {
    try {
      const response = await axios.post(
        EXPO_PUSH_RECEIPTS_URL,
        { ids: ticketIds },
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );
      return response.data?.data ?? {};
    } catch (error: any) {
      logger.error(`Failed to fetch Expo push receipts: ${error.message}`);
      return {};
    }
  }
}