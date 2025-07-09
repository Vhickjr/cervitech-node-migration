import { UserRepository } from '../infrastructure/repositories/user.repository';
import { IAppUser } from '../models/AppUser';

class CustomException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomException';
  }
}

export class UserService {
  static async setAllowPushNotifications(userId: string, allow: boolean): Promise<IAppUser | null> {
    return await UserRepository.updateAllowPushNotifications(userId, allow);
  }

  static async toggleAllowPushNotifications(userId: string): Promise<boolean> {
    const user = await UserRepository.findAppUserById(userId);
    if (!user) {
      throw new CustomException('User not found');
    }
    
    const newStatus = !user.allowPushNotifications;
    await UserRepository.updateAllowPushNotifications(userId, newStatus);
    return newStatus;
  }
} 