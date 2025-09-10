import AppUser from '../../models/AppUser';
import { Goal } from '../../models/Goal';
import { CustomException } from '../../helpers/CustomException';
import { logger } from '../../utils/logger';
import { validatePassword } from '../../utils/passwordUtils';
import { DateLibrary } from '../../helpers/dateLibrary';
import { LoginViewModel, AppUserViewModel } from '../../dtos/auth.DTO';
import { HashUtil } from '../../utils/hash';

export class AuthService {
  static async authenticate(model: LoginViewModel): Promise<AppUserViewModel> {
    try {
      if (!['ANDROID', 'IOS', 'OTHER'].includes(model.mobileChannel)) {
        throw new Error('Please make sure you pass a valid MobileChannel value for this user');
      }

      if (!model.emailOrUsername || model.emailOrUsername.trim() === '') {
        throw new CustomException('Please provide an email or username');
      }

      const identifier = model.emailOrUsername.trim();
      logger.info(`Authenticating user with identifier: ${identifier}`);

      const user = await AppUser.findOne({ email: identifier }).exec();

      if (!user) {
        throw new CustomException('This account does not exist. Please check the email or username provided.');
      }
      console.log(user.salt)
      const isValidPassword = HashUtil.compare(model.password, user.password);

      if (!isValidPassword) {
        throw new CustomException('An incorrect password provided. Please check password and try again.');
      }

      user.lastLoginDateTime = DateLibrary.getCurrentDateTime();
      await user.save();

      const lastSetGoal = await Goal.findOne({ appUserId: user._id }).exec();

      const currentTargetedAverageNeckAngle = lastSetGoal?.targetedAverageNeckAngle ?? 0;

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasPaid: user.hasPaid,
        pictureUrl: user.pictureUrl,
        fcmToken: user.fcmToken,
        isGoalOn: user.isGoalOn,
        allowPushNotifications: user.allowPushNotifications,
        mobileChannel: user.mobileChannel,
        currentTargetedAverageNeckAngle,
        dateRegistered: user.dateRegistered,
        responseRate: user.responseRate,
        lastLoginDateTime: user.lastLoginDateTime,
        prompt: user.prompt,
        notificationCount: user.notificationCount
      };
    } catch (error) {
      if (error instanceof CustomException) {
        logger.error(error.message);
        throw error;
      }

      logger.error('Unexpected error during authentication:', error);
      throw new Error('Internal server error');
    }
  }
}
