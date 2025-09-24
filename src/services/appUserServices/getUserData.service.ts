import { CustomException } from '../../helpers/CustomException';
import { logger } from '../../utils/logger';
import AppUser from '../../models/AppUser';
import { AppUserViewModel } from '../../dtos/auth.DTO';

export class GetUserDataService {
    
  static async getByEmail(email: string): Promise<AppUserViewModel> {
    try {
      const user = await AppUser.findOne({ email: email }).exec();

      if (!user) {
        throw new CustomException(
          'This Email does not exist in our system. Please ensure it is the email you registered with.'
        );
      }

      return {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        email: user.email,
        pictureUrl: user.pictureUrl,
        fcmToken: user.fcmToken,
        allowPushNotifications: user.allowPushNotifications,
        hasPaid: user.hasPaid,
        mobileChannel: user.mobileChannel,
        isGoalOn: user.isGoalOn,
        dateRegistered: user.dateRegistered,
        responseRate: user.responseRate,
        lastLoginDateTime: user.lastLoginDateTime,
        prompt: user.prompt,
        notificationCount: user.notificationCount,
        currentTargetedAverageNeckAngle: user.currentTargetedAverageNeckAngle,
      }
    } 
    catch (error) {
      if (error instanceof CustomException) {
        logger.error(error.message);
        throw error;
      }
      logger.error('Unexpected error while retrieving user by email:', error);
      throw new Error('Internal server error');
    }
  }

  public async getFCMTokenByUsername(username: string): Promise<string> {
      try {
        const user = await AppUser.findOne({ username }).exec();
  
        if (!user) {
          throw new CustomException('We cannot retrieve the user at the moment. Please try again later.');
        }
  
        if (!user.fcmToken || user.fcmToken.trim() === '') {
          throw new CustomException('This user does not have an FCM token.');
        }
  
        return user.fcmToken;
      } catch (error) {
        if (error instanceof CustomException) {
          logger.error(error.message);
          throw error;
        }
  
        logger.error('Unexpected error while retrieving FCM token:', error);
        throw new Error('Internal server error');
      }
    }

    static async getAllowPushNotificationStatus(id: string): Promise<boolean> {
    try {
      const user = await AppUser.findOne({ _id: id }).exec();

      if (!user) {
        throw new CustomException('User does not exist in our system');
      }

      return user.allowPushNotifications;
    } catch (error) {
      if (error instanceof CustomException) {
        logger.error(error.message);
        throw error;
      }
      throw new Error('Unexpected error occurred');
    }
  }
}
