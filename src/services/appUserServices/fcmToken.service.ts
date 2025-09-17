// services/appUserService.ts
import AppUser from '../../models/AppUser';
import { AppUserViewModel } from '../../dtos/auth.DTO';
import { FCMTokenUpdateViewModel } from '../../dtos/fcmToken.DTO';
import { CustomException } from '../../helpers/CustomException';
import { logger } from '../../utils/logger';

export class FCMTokenService {
  static async updateFCMToken(update: FCMTokenUpdateViewModel): Promise<AppUserViewModel> {
    try {
      if (!update || typeof update._id !== 'string') {
        throw new CustomException('UserId is not provided');
      }

      const user = await AppUser.findOne({ _id: update._id }).exec();
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
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        pictureUrl: user.pictureUrl,
        fcmToken: user.fcmToken,
        prompt: user.prompt,
        currentTargetedAverageNeckAngle: user.currentTargetedAverageNeckAngle,
        isGoalOn: user.isGoalOn,
        hasPaid: user.hasPaid,
        allowPushNotifications: user.allowPushNotifications,
        responseRate: user.responseRate,
        dateRegistered: user.dateRegistered?.toISOString() ?? '',
        lastLoginDateTime: user.lastLoginDateTime,
        mobileChannel: user.mobileChannel,
        notificationCount: user.notificationCount,
      };
    } catch (ex: unknown) {
      const error = ex instanceof Error ? ex : new Error('Unhandled exception');
      logger.error(error.message);
      throw error;
    }
  }
}