import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
//1. Import AppUser from the actual MongoDB model
import AppUser from "../viewmodels/AppUser";
import { SubscriptionUpdateViewModel } from "../viewmodels/SubscriptionUpdateViewModel";
import { CustomException } from "../helpers/CustomException";
import { AppUserResponse, ResponseRateViewModel } from "../viewmodels/ResponseRateViewModel";
import ResponseRate from "../viewmodels/ResponseRateViewModel";
import { Activity } from "../viewmodels/Activity";
import { NeckAngleRecordModel } from "../models/NeckAngleRecord";
import { DateLibrary } from "../helpers/dateLibrary";
import { Goal } from "../models/Goal";
import { GoalCycleCompletionReport } from "../models/GoalCycleCompletionReport";
import { logger } from "../utils/logger";
import { PushNotificationDriver } from "./pushNotificationDriver";
import { PushNotificationModelDTO } from "../dtos/PushNotificationModelDTO";


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

      await user.save(); // saves updated document

      // Build and return AppUserViewModel-like object
      return {
        id: user._id as string,
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
      console.error("Error in updateSubscriptionAsync:", error);
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
  };

  static async getResponseRateAsync(userId: string, day: Date): Promise<ResponseRateViewModel> {
    try {
      // Set time boundaries for the day
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      // Query response rates for that user on that day
      const responseRates = await ResponseRate.find({
        appUserId: userId,
        dateCreated: { $gte: startOfDay, $lte: endOfDay }
      });

      const totalPrompts = responseRates.reduce((sum: any, r: { prompt: any; }) => sum + (r.prompt || 0), 0);
      const totalResponses = responseRates.reduce((sum: number, r: { response: any; }) => sum + (r.response || 0), 0);

      // Group by hour
      const groupedByHour: Record<number, { prompts: number; responses: number }> = {};

      responseRates.forEach((entry) => {
        const hour = new Date(entry.dateCreated).getHours();

        if (!groupedByHour[hour]) {
          groupedByHour[hour] = { prompts: 0, responses: 0 };
        }

        groupedByHour[hour].prompts += entry.prompt || 0;
        groupedByHour[hour].responses += entry.response || 0;
      });

      const activity: Activity[] = Object.entries(groupedByHour).map(([hourStr, group]) => {
        const hour = parseInt(hourStr);
        const { prompts, responses } = group;
        const activityPercentage = prompts === 0 ? 0 : (responses / prompts) * 100;

        return { hour, prompts, responses, activityPercentage };
      });

      const responseRate = totalPrompts === 0 ? 0 : (totalResponses / totalPrompts) * 100;

      const rrvm: ResponseRateViewModel = {
        appUserId: userId,
        responseRate,
        totalPrompts,
        totalResponses,
        activity
      };

      return rrvm;

    } catch (err: any) {
      console.error("Error in getResponseRateAsync:", err.message);
      throw new CustomException("Error retrieving response rate.");
    }
  };

}

export const calculateAverageOfLastWeekOrDay = async (
  userId: number,
  frequency: string,
  dateCreated: Date,
  goalId: string
): Promise<boolean> => {
  try {
    let average = 0;
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

    average = records.reduce((sum, r) => sum + r.angle, 0) / records.length;

    const goal = await Goal.findById(goalId);
    if (!goal) return false;

    const goalCycleReport = new GoalCycleCompletionReport({
      actualAverageNeckAngle: isNaN(average) ? 0 : Math.round(average * 10) / 10,
      complianceInPercentage: 0,
      dateOfConcludedCycle: DateLibrary.getCurrentDateTime(),
      goalId
    });

    if (average >= goal.targetedAverageNeckAngle) {
      goalCycleReport.complianceInPercentage = 100;
    } else {
      const compliance = (average / goal.targetedAverageNeckAngle) * 100;
      goalCycleReport.complianceInPercentage = isNaN(compliance)
        ? 0
        : Math.min(100, Math.round(compliance * 10) / 10);
    }

    await goalCycleReport.save();

    const userFCMToken = await getFCMTokenById(userId);
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

async function getFCMTokenById(id: number): Promise<string> {
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