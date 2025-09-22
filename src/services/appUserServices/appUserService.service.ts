import AppUser from "../../viewmodels/AppUser";
import ResponseRate from "../../viewmodels/ResponseRateViewModel";
import { PictureUrlUpdateViewModel } from "../../viewmodels/PictureUrlUpdateViewModel";
import { SubscriptionUpdateViewModel } from "../../viewmodels/SubscriptionUpdateViewModel";
import { AppUserResponse, ResponseRateViewModel } from "../../viewmodels/ResponseRateViewModel";
import { MailService } from "../MailService";
import { MailSender } from "../MailSender";
import { SendGridEmailSender } from "../SendGridEmailSender";
import { Activity } from "../../viewmodels/Activity";
import { CustomException } from "../../utils/customException";
import { EmailTemplates } from "../EmailTemplates";
import { NeckAngleRecordModel } from "../../models/NeckAngleRecord";
import { DateLibrary } from "../../utils/dateLibrary";
import { Goal } from "../../models/Goal";
import { GoalCycleCompletionReport } from "../../models/GoalCycleCompletionReport";
import { PushNotificationDriver } from "../pushNotificationDriver";
import { PushNotificationModelDTO } from "../../types/pushNotificationModel.types";
import { logger } from "../../utils/logger";
import {UpdateUserRequest} from "../../types/user.types";
import {AppUserViewModel} from "../../viewmodels/AppUserViewModel";
import User from "../../models/User";
// import {FCMTokenUpdateViewModel} from "../../viewmodels/FCMTokenUpdateViewModel";
import { TokenUtil } from "../../utils/token.util";

const mailSender = new MailSender(logger);
const emailTemplates = new EmailTemplates(logger);
const sendGridEmailSender = new SendGridEmailSender(emailTemplates);
const mailService = new MailService(logger, emailTemplates, mailSender, sendGridEmailSender);


export class AppUserService {
  static async updateSubscriptionAsync(userId: string): Promise<AppUserResponse> {
    try {
      if (!userId || userId.trim() === "") {
        throw new Error("UserId not provided");
      }

      const user = await AppUser.findById(userId);
      if (!user) {
        throw new Error("This user cannot be retrieved at the moment. Please contact support.");
      }

      user.hasPaid = true;
      await user.save();

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        FCMToken: user.fcmToken,
        hasPaid: user.hasPaid,
        firstName: user.firstName,
        lastName: user.lastName,
        pictureUrl: user.pictureUrl,
        salt: user.salt,
        hash: user.hash,
        isGoalOn: user.isGoalOn,
        allowPushNotifications: user.allowPushNotifications,
        mobileChannel: user.mobileChannel,
        dateRegistered: user.dateRegistered?.toString(),
        responseRate: user.responseRate,
        lastLoginDateTime: user.lastLoginDateTime
      };
    } catch (error) {
      logger.error("Error in updateSubscriptionAsync:");
      throw new CustomException("Error updating subscription.");
    }
  }

  static async updatePictureUrlAsync(update: PictureUrlUpdateViewModel): Promise<boolean> {
    if (!update || update.userId < 1) {
      throw new Error("UserId not provided");
    }

    const user = await AppUser.findById(update.userId);
    if (!user) {
      throw new Error("This user cannot be retrieved at the moment. Please contact support.");
    }

    user.pictureUrl = update.pictureUrl ?? user.pictureUrl;
    await new Promise(resolve => setTimeout(resolve, 500));

    return true;
  }

  static async deleteByIdAsync(id: string): Promise<boolean> {
  try {
    const user = await AppUser.findById(id);

    if (!user) {
      throw new CustomException("User does not exist");
    }

    user.deleted = true;
    await user.save();

    try {
      await mailService.sendAccountDeletionConfirmationMail(
        user.email.trim().toLowerCase(),
        user.username
      );
    } catch (emailError) {
      logger.error("Failed to send deletion confirmation email:", emailError);
    }

    return true;
  } catch (ex: any) {
    if (ex instanceof CustomException) {
      logger.error(ex.message);
    } else {
      logger.error("Unexpected error while deleting by ID", { error: ex });
    }
    throw ex;
  }
}

static async deleteByEmailAsync(email: string): Promise<boolean> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await AppUser.findOne({ email: normalizedEmail });

    if (!user) {
      throw new CustomException("User does not exist");
    }

    user.deleted = true;
    await user.save();

    try {
      await mailService.sendAccountDeletionConfirmationMail(
        normalizedEmail,
        user.username
      );
    } catch (emailError) {
      logger.error("Failed to send deletion confirmation email:", emailError);
    }

    return true;
  } catch (ex: any) {
    if (ex instanceof CustomException) {
      logger.error(ex.message);
    } else {
      logger.error("Unexpected error while deleting by email", { error: ex });
    }
    throw ex;
  }
}

static async deleteAccountRequest(email: string): Promise<boolean> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await AppUser.findOne({ email: normalizedEmail });

    if (!user) {
      throw new CustomException("User does not exist");
    }

    const token = await TokenUtil.generateResetToken(user._id.toString());
    console.log("Generated token:", token);

    await mailService.sendAccountDeletionMail(
      normalizedEmail,
      user.username,
      token
    );

    return true;
  } catch (ex: any) {
    if (ex instanceof CustomException) {
      logger.error(ex.message);
    } else {
      logger.error("Unexpected error while requesting account deletion", {
        error: ex,
      });
    }
    throw ex;
  }
}

static async deleteAllAsync(): Promise<boolean> {
  try {
    await AppUser.updateMany(
      { deleted: { $ne: true } }, 
      { $set: { deleted: true } }
    );
    return true;
  } catch (ex: any) {
    logger.error("Unexpected error while deleting all users", { error: ex });
    throw ex;
  }
}


  static async toggleAllowPushNotificationsAsync(userId: string): Promise<boolean> {
    try {
      if (!userId || userId.trim() === "") {
        throw new Error("UserId not provided");
      }

      const user = await AppUser.findById(userId);
      if (!user) {
        throw new Error("User not found.");
      }

      user.allowPushNotifications = !user.allowPushNotifications;
      await user.save();

      return user.allowPushNotifications;
    } catch (error) {
      logger.error("Error in toggleAllowPushNotificationsAsync:", error);
      throw new CustomException("Error toggling push notifications.");
    }
  }

  static async getResponseRateAsync(userId: string, day: Date): Promise<ResponseRateViewModel> {
    try {
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      const responseRates = await ResponseRate.find({
        appUserId: userId,
        dateCreated: { $gte: startOfDay, $lte: endOfDay }
      });

      const totalPrompts = responseRates.reduce((sum, r) => sum + (r.prompt || 0), 0);
      const totalResponses = responseRates.reduce((sum, r) => sum + (r.response || 0), 0);

      const groupedByHour: Record<number, { prompts: number; responses: number }> = {};
      responseRates.forEach(entry => {
        const hour = new Date(entry.dateCreated).getHours();
        if (!groupedByHour[hour]) {
          groupedByHour[hour] = { prompts: 0, responses: 0 };
        }
        groupedByHour[hour].prompts += entry.prompt || 0;
        groupedByHour[hour].responses += entry.response || 0;
      });

      const activity: Activity[] = Object.entries(groupedByHour).map(([hourStr, group]) => {
        const hour = parseInt(hourStr);
        const activityPercentage = group.prompts === 0 ? 0 : (group.responses / group.prompts) * 100;
        return { hour, prompts: group.prompts, responses: group.responses, activityPercentage };
      });

      const responseRate = totalPrompts === 0 ? 0 : (totalResponses / totalPrompts) * 100;

      return {
        appUserId: userId,
        responseRate,
        totalPrompts,
        totalResponses,
        activity
      };
    } catch (error) {
      logger.error("Error in getResponseRateAsync:");
      throw new CustomException("Error retrieving response rate.");
    }
  }

  static async calculateAverageOfLastWeekOrDay(
    userId: string,
    frequency: string,
    dateCreated: Date,
    goalId: string
  ): Promise<boolean> {
    try {
      let records;

      if (frequency === 'DAILY') {
        records = await NeckAngleRecordModel.find({
          appUserId: userId,
          dateTimeRecorded: {
            $gte: DateLibrary.getYesterdayDateTime(),
            $lte: DateLibrary.getCurrentDateTime()
          }
        });
      } else if (frequency === 'WEEKLY') {
        records = await NeckAngleRecordModel.find({
          appUserId: userId,
          dateTimeRecorded: {
            $gte: DateLibrary.getLastWeekDateTime(),
            $lte: DateLibrary.getCurrentDateTime()
          }
        });
      } else {
        throw new CustomException('Invalid Goal Frequency');
      }

      if (records.length === 0) return false;

      const average = records.reduce((sum, r) => sum + r.angle, 0) / records.length;
      const goal = await Goal.findById(goalId);
      if (!goal) return false;

      const compliance = average >= goal.targetedAverageNeckAngle
        ? 100
        : Math.min(100, Math.round((average / goal.targetedAverageNeckAngle) * 1000) / 10);

      const goalCycleReport = new GoalCycleCompletionReport({
        actualAverageNeckAngle: isNaN(average) ? 0 : Math.round(average * 10) / 10,
        complianceInPercentage: isNaN(compliance) ? 0 : compliance,
        dateOfConcludedCycle: DateLibrary.getCurrentDateTime(),
        goalId
      });

      await goalCycleReport.save();

      const userFCMToken = await this.getFCMTokenById(userId);
      if (!userFCMToken) throw new CustomException('User does not have an FCM Token');

      const pushNotificationModel: PushNotificationModelDTO = {
        to: userFCMToken,
        title: 'Your set goal',
        body: `Hi, you scored ${goalCycleReport.complianceInPercentage}/100`
      };

      await PushNotificationDriver.sendPushNotification(pushNotificationModel);

      return true;
    } catch (error) {
      logger.error(error instanceof CustomException ? error.message : String(error));
      throw error;
    }
  }

  static async getFCMTokenById(id: string): Promise<string> {
    try {
      const user = await AppUser.findOne({ id }).exec();
      if (!user) {
        throw new CustomException('User does not exist in our system');
      }
      return user.fcmToken;
    } catch (error) {
      logger.error(error instanceof CustomException ? error.message : String(error));
      throw error;
    }
  }

    static async updateUser(userId: string, update: UpdateUserRequest): Promise<AppUserViewModel>{
    if (!userId) {
      throw new CustomException("User Id is missing from request.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomException(
        "This user cannot be retrieved at the moment, please contact support."
      );
    }
    user.email = update.email ?? user.email;
    user.firstName = update.firstName ?? user.firstName;
    user.lastName = update.lastName ?? user.lastName;
    user.username = update.username ?? user.username;
    user.telephone = update.telephone ?? user.telephone;

    await user.save();

      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        pictureUrl: user.pictureUrl,
        fcmToken: user.fcmToken,
        hash: user.hash,
        salt: user.salt,
        currentTargetedAverageNeckAngle: user.currentTargetedAverageNeckAngle ?? 0,
        isGoalOn: user.isGoalOn ?? false,
        hasPaid: user.hasPaid ?? false,
        allowPushNotifications: user.allowPushNotifications ?? true,
        mobileChannel: user.mobileChannel ?? 1,
        dateRegistered: user.dateRegistered?.toISOString() ?? new Date().toISOString(),
        responseRate: user.responseRate ?? 0,
        lastLoginDateTime: user.lastLoginDateTime ?? new Date(),
        neckAngleRecords: user.neckAngleRecords ?? [], 
        notificationCount: user.notificationCount ?? 0,
        prompt: user.prompt ?? 0,
        deleted: user.deleted ?? false
      };
  }


    static async updateFCMToken(userId: string, fcmToken:string): Promise<AppUserViewModel>{
        if (!userId) { 
        throw new CustomException("UserId is not provided");
        }

        const user = await User.findById(userId);
        if (!user) {
        throw new CustomException("This user cannot be retrieved at the moment, please contact support.");
        }

        user.fcmToken = fcmToken ?? user.fcmToken;

        await user.save();

        
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          pictureUrl: user.pictureUrl,
          fcmToken: user.fcmToken,
          hash: user.hash,
          salt: user.salt,
          currentTargetedAverageNeckAngle: user.currentTargetedAverageNeckAngle ?? 0,
          isGoalOn: user.isGoalOn ?? false,
          hasPaid: user.hasPaid ?? false,
          allowPushNotifications: user.allowPushNotifications ?? true,
          mobileChannel: user.mobileChannel ?? 1,
          dateRegistered: user.dateRegistered?.toISOString() ?? new Date().toISOString(),
          responseRate: user.responseRate ?? 0,
          lastLoginDateTime: user.lastLoginDateTime ?? new Date(),
          neckAngleRecords: user.neckAngleRecords ?? [], 
          notificationCount: user.notificationCount ?? 0,
          prompt: user.prompt ?? 0,
          deleted: user.deleted ?? false
        };
  }

  static async emailAlreadyExistsAsync(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  const exists = await AppUser.exists({ email: normalizedEmail });

  return !!exists; // convert result to true/false
}

}

