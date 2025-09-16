import AppUser from "../../viewmodels/AppUser";
import ResponseRate from "../../viewmodels/ResponseRateViewModel";
import { PictureUrlUpdateViewModel } from "../../viewmodels/PictureUrlUpdateViewModel";
import { SubscriptionUpdateViewModel } from "../../viewmodels/SubscriptionUpdateViewModel";
import { AppUserResponse, ResponseRateViewModel } from "../../viewmodels/ResponseRateViewModel";
// import { MailService } from "../mailService";
import { Activity } from "../../viewmodels/Activity";
import { CustomException } from "../../helpers/customException";
import { NeckAngleRecordModel } from "../../models/NeckAngleRecord";
import { DateLibrary } from "../../helpers/dateLibrary";
import { Goal } from "../../models/Goal";
import { GoalCycleCompletionReport } from "../../models/GoalCycleCompletionReport";
import { PushNotificationDriver } from "../pushNotificationDriver";
import { PushNotificationModelDTO } from "../../types/pushNotificationModel.types";
import { logger } from "../../utils/logger";
import {UpdateUserRequest} from "../../types/user.types";
import {AppUserViewModel} from "../../viewmodels/AppUserViewModel";
import User from "../../models/User";
import {FCMTokenUpdateViewModel} from "../../viewmodels/FCMTokenUpdateViewModel";
import { NeckAngleParametersViewModel } from "../../viewmodels/NeckAngleParameters.viewmodel";
import { AbbreviatedNeckAngleRecordViewModel } from "../../viewmodels/AbbreviatedNeckAngleRecord.viewmodel";
import { DailyAngleDataViewModel } from "../../viewmodels/DailyAngleData.viewmodel";
import { GoalCycleReportViewModel } from "../../viewmodels/GoalCycleReport.viewmodel";
import {Utils} from "../../helpers/utils";

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

    await user.deleteOne();

    // await new MailService().sendAccountDeletionMail(
    //   user.email.trim().toLowerCase(),
    //   user.username
    // );

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

    await user.deleteOne();

    // await new MailService().sendAccountDeletionMail(normalizedEmail, user.username, deletionToken)

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
          prompt: user.prompt ?? 0
        };
  }
  // inside AppUserService class

static async computeNeckAngleParametersAsync(userId: string): Promise<NeckAngleParametersViewModel> {
  try {
    const userDetails = await User.findById(userId).exec();
    if (!userDetails) throw new CustomException('User not found');

    const today = new Date();
    const startOfDay = DateLibrary.startOfDay(today);
    const endOfDay = DateLibrary.endOfDay(today);
    const startOfWeek = DateLibrary.startOfWeek(today);
    const endOfWeek = DateLibrary.endOfWeek(today);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // fetch records
    const recordsRaw = await NeckAngleRecordModel.find({ appUserId: userId }).exec();
    const records: AbbreviatedNeckAngleRecordViewModel[] = recordsRaw.map((r: any) => ({
      angle: r.angle,
      craniumVertebralAngle: r.craniumVertebralAngle,
      dateTimeRecorded: r.dateTimeRecorded instanceof Date ? r.dateTimeRecorded : new Date(r.dateTimeRecorded)
    }));

    // safe average utility
    const safeAvg = (arr: AbbreviatedNeckAngleRecordViewModel[]): number =>
      arr.length === 0 ? 0 : +(arr.reduce((s, a) => s + a.angle, 0) / arr.length).toFixed(1);

    const thisDay = records.filter(r => r.dateTimeRecorded >= startOfDay && r.dateTimeRecorded <= endOfDay);
    const thisWeek = records.filter(r => r.dateTimeRecorded >= startOfWeek && r.dateTimeRecorded <= endOfWeek);
    const thisMonth = records.filter(r => r.dateTimeRecorded.getMonth() === currentMonth && r.dateTimeRecorded.getFullYear() === currentYear);

    const currentDayAverageNeckAngle = safeAvg(thisDay);
    const currentWeekAverageNeckAngle = safeAvg(thisWeek);
    const currentMonthAverageNeckAngle = safeAvg(thisMonth);

    const averageNeckAngleForEachDayOfTheCurrentWeek = DateLibrary.getEachDayOfWeekAverage(thisWeek);
    const withPositive = averageNeckAngleForEachDayOfTheCurrentWeek.filter((d: DailyAngleDataViewModel) => d.averageNeckAngle > 0);

    let bestDay: DailyAngleDataViewModel | null = null;
    let badDay: DailyAngleDataViewModel | null = null;
    if (withPositive.length > 0) {
      bestDay = withPositive.reduce((a, b) => (a.averageNeckAngle >= b.averageNeckAngle ? a : b));
      badDay = withPositive.reduce((a, b) => (a.averageNeckAngle <= b.averageNeckAngle ? a : b));
      if (badDay && bestDay && badDay.day === bestDay.day) badDay = null;
    }

    // scoring
    let totalPoint = 0;
    for (const rec of records) {
      const a = rec.angle ?? 0;
      if (a >= 10 && a <= 19) totalPoint += 1;
      else if (a >= 20 && a <= 29) totalPoint += 2;
      else if (a >= 30 && a <= 39) totalPoint += 3;
      else if (a >= 40 && a <= 49) totalPoint += 4;
      else if (a >= 50) totalPoint += 5;
    }
    const averageNeckAngleStarRatingOver5 = records.length === 0 ? 0 : +(totalPoint / records.length).toFixed(2);

    // last goals
    const lastGoals = await Goal.find({ appUserId: userId }).sort({ _id: -1 }).limit(2).lean().exec();
    let lastSetGoalWithDetails: GoalCycleReportViewModel | null = null;
    if (lastGoals && lastGoals.length > 0) {
      const g = lastGoals[0] as any;
      lastSetGoalWithDetails = {
        frequency: g.frequency,
        targetedAverageNeckAngle: g.targetedAverageNeckAngle,
        actualAverageNeckAngle: null,
        complianceInPercentage: null,
        dateOfConcludedCycle: null,
        dayOfConcludedCycle: null,
        colorTag: null
      };

      const goalReport = await GoalCycleCompletionReport.findOne({ goalId: g._id }).sort({ _id: -1 }).exec();
      if (goalReport) {
        lastSetGoalWithDetails.actualAverageNeckAngle = goalReport.actualAverageNeckAngle;
        lastSetGoalWithDetails.complianceInPercentage = goalReport.complianceInPercentage;
        lastSetGoalWithDetails.dateOfConcludedCycle = goalReport.dateOfConcludedCycle;
        lastSetGoalWithDetails.dayOfConcludedCycle = DateLibrary.formatDay(goalReport.dateOfConcludedCycle?.toString() ?? '');
        lastSetGoalWithDetails.colorTag = Utils.getColorTag(goalReport.complianceInPercentage ?? 0);
      }
    }

    // compute averages per week of month (simple implementation)
    // const averageNeckAngleForEachWeekOfTheCurrentMonth = this.getEachWeekOfMonthAverage(thisMonth);
    //commented out from return and neck angle parameters view model

    return {
      username: userDetails.username,
      averageNeckAngleStarRatingOver5,
      responseRate: Math.round((userDetails.responseRate ?? 0) * 10) / 10,
      lastSetGoalWithDetails,
      dailyNeckAngleRecords: thisDay,
      weeklyNeckAngleRecords: thisWeek,
      monthlyNeckAngleRecords: thisMonth,
      currentDayAverageNeckAngle,
      currentWeekAverageNeckAngle,
      currentMonthAverageNeckAngle,
      bestWeekDayAverageNeckAngle: bestDay,
      badWeekDayAverageNeckAngle: badDay,
      averageNeckAngleForEachDayOfTheCurrentWeek,
      //averageNeckAngleForEachWeekOfTheCurrentMonth
    };
  } catch (error) {
    logger.error("Error in computeNeckAngleParametersAsync:", error);
    throw error instanceof CustomException ? error : new CustomException('Error computing neck angle parameters');
  }
}

// Helper method inside the same class (AppUserService)

}

