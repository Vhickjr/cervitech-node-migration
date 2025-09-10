import AppUser from '../../models/AppUser';// your Mongoose model
import { CustomException } from '../../helpers/CustomException';
import { logger } from '../../utils/logger';

export class getFCMTokenByUsernameService {
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
}
