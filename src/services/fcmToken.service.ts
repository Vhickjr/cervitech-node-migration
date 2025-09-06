// services/appUserService.ts
import  AppUser  from '../models/AppUser';
import { appUserViewModel } from '../viewmodels/AppUserViewModel';
import { FCMTokenUpdateViewModel } from '../dtos/fcmToken.DTO';
import { CustomException } from '../helpers/CustomException';
import { logger } from '../utils/logger';

export class FCMTokenService {
  static async updateFCMTokenAsync(update: FCMTokenUpdateViewModel): Promise<appUserViewModel> {
    try {
      if (!update || typeof update.userId !== 'number' || update.userId < 1) {
        throw new CustomException('UserId is not provided');
      }

      const user = await AppUser.findOne({ id: update.userId });
      if (!user) {
        throw new CustomException(
          'This user cannot be retrieved at the moment, please contact support.'
        );
      }

      user.fcmToken = update.fcmToken ?? user.fcmToken;
      await user.save();

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        pictureUrl: user.pictureUrl,
        fcmToken: user.fcmToken,
        prompt: user.prompt,
        hash: user.hash,
        salt: user.salt,
        currentTargetedAverageNeckAngle: user.currentTargetedAverageNeckAngle,
        isGoalOn: user.isGoalOn,
        hasPaid: user.hasPaid,
        allowPushNotifications: user.allowPushNotifications,
        responseRate: user.responseRate,
        dateRegistered: user.dateRegistered.toISOString(),
        lastLoginDateTime: user.lastLoginDateTime,
        neckAngleRecords: user.neckAngleRecords,
        mobileChannel: user.mobileChannel,
        notificationCount: user.notificationCount,
        notificationResponse: user.notificationResponse,
      };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unhandled exception');
      logger.error(err.message);
      throw err;
    }
  }
};

