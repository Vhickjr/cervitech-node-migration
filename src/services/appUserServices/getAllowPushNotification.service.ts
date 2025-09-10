import AppUser from '../../models/AppUser';
import { CustomException } from '../../helpers/CustomException';
import { logger } from '../../utils/logger';

export class GetAllowPushNotificationService {
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
