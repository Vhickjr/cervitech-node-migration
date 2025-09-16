import { Types } from 'mongoose';
import { NeckAngleModel } from '../../models/neckAngle';
import { NeckAngleRecordModel } from '../../models/NeckAngleRecord';
import { SendAverageNeckAnglePushNotificationViewModel } from '../../viewmodels/PushNotificationViewModel';
import { getCraniumVertebralAngleFromNeckAngle } from '../../helpers/computations';
import  AppUser  from '../../models/AppUser';
import { CustomException } from '../../helpers/CustomException';
import { logger } from '../../utils/logger';
import { DateLibrary } from "../../helpers/dateLibrary";
import { AbbreviatedNeckAngleRecordViewModel } from "../../viewmodels/AbbreviatedNeckAngleRecordViewModel";
import { WeeklyAngleDataViewModel } from "../../viewmodels/WeeklyAngleDataViewModel";
import { INeckAngleRecord } from '../../models/NeckAngleRecord';
import ResponseRate from '../../models/ResponseRate';
import { IAppUser } from '../../models/AppUser';
import { PushNotificationDriver } from '../pushNotificationDriver';
import { Utils } from '../../helpers/utils';
import { neckAngleRecordViewModel } from '../../viewmodels/neckAngleRecord.viewmodels';
import { Calculator } from '../../helpers/calculator';
import { AutomatePostNeckAngleRecordsViewModel } from '../../viewmodels/AutomatePostNeckAngleRecords';
import { Goal } from '../../models/Goal';
import { GoalCycleCompletionReport } from '../../models/GoalCycleCompletionReport';
import { GOAL_FREQUENCY } from '../../enums/goalFrequency';



export class NeckAngleService {
  static async postBatchNeckAngleRecordAsync(neckAngleModel: NeckAngleModel): Promise<boolean> {
    try {
      for (const record of neckAngleModel.neckAngleRecords) {
        const appUser = await AppUser.findOne({ id: record.appUserId });
        if (!appUser) {
          logger.warn(`AppUser ${record.appUserId} not found, skipping.`);
          continue;
        }

        const lastRecord = await NeckAngleRecordModel
          .findOne({ appUserId: record.appUserId })
          .sort({ counter: -1 });

        const counter = (lastRecord?.counter ?? 0) + 1;
        const craniumVertebralAngle = getCraniumVertebralAngleFromNeckAngle(record.angle);

        const neckAngleRecord = new NeckAngleRecordModel({
          appUserId: record.appUserId,
          craniumVertebralAngle,
          counter,
          dateTimeRecorded: new Date(record.dateTimeRecorded),
          angle: record.angle,
        });

        await neckAngleRecord.save();

        if (appUser.prompt && counter % appUser.prompt === 0) {
          const averageNeckAngle = await this.calculateAverageOfLastSetNeckAngles(record.appUserId);
          const notificationPayload: SendAverageNeckAnglePushNotificationViewModel = {
            userId: record.appUserId,
            averageNeckAngle,
          };
          await this.sendPushNotificationMessageForAverageNeckAngle(notificationPayload);
        }
      }

      return true;
    } catch (error: any) {
      logger.error(error.message || 'Unhandled exception');
      throw error;
    }
  }

  static readonly numberOfRecordPostBeforeSendingAverageNeckAngle: number = parseInt(process.env.ENV_NUMBER_OF_RECORD_POST_BEFORE_SENDING_AVERAGE_NECK_ANGLE || '0', 10);

  static async getEachWeekOfTheMonthAverageNeckAngle(aMonthAngleRecords: AbbreviatedNeckAngleRecordViewModel[]): Promise<WeeklyAngleDataViewModel[]> {
    try {
      let weekOneRecords = 0,
        weekTwoRecords = 0,
        weekThreeRecords = 0,
        weekFourRecords = 0,
        weekFiveRecords = 0;

      let weekOneCount = 0,
        weekTwoCount = 0,
        weekThreeCount = 0,
        weekFourCount = 0,
        weekFiveCount = 0;

      for (const record of aMonthAngleRecords) {
        const weekNum = DateLibrary.getWeekNumberOfMonth(record.dateTimeRecorded);

        switch (weekNum) {
          case 1:
            weekOneRecords += record.angle;
            weekOneCount++;
            break;
          case 2:
            weekTwoRecords += record.angle;
            weekTwoCount++;
            break;
          case 3:
            weekThreeRecords += record.angle;
            weekThreeCount++;
            break;
          case 4:
            weekFourRecords += record.angle;
            weekFourCount++;
            break;
          case 5:
            weekFiveRecords += record.angle;
            weekFiveCount++;
            break;
          default:
            break;
        }
      }

      const averageNeckAngleForEachWeekOfTheMonthWeek: WeeklyAngleDataViewModel[] = [
        {
          week: 1,
          averageNeckAngle: weekOneCount < 1 ? 0 : weekOneRecords / weekOneCount,
        },
        {
          week: 2,
          averageNeckAngle: weekTwoCount < 1 ? 0 : weekTwoRecords / weekTwoCount,
        },
        {
          week: 3,
          averageNeckAngle:
            weekThreeCount < 1 ? 0 : weekThreeRecords / weekThreeCount,
        },
        {
          week: 4,
          averageNeckAngle:
            weekFourCount < 1 ? 0 : weekFourRecords / weekFourCount,
        },
        {
          week: 5,
          averageNeckAngle:
            weekFiveCount < 1 ? 0 : weekFiveRecords / weekFiveCount,
        },
      ];

      return averageNeckAngleForEachWeekOfTheMonthWeek;
    } catch (error: any) {
      logger.error(
        "Error in getEachWeekOfTheMonthAverageNeckAngle:",
        error.message
      );
      throw new CustomException("Error calculating weekly averages.");
    }
}


  static async calculateAverageOfLastSetNeckAngles(userId: string): Promise<number> {
    const records = await NeckAngleRecordModel.find({ appUserId: userId })
      .sort({ _id: -1 })
      .limit(NeckAngleService.numberOfRecordPostBeforeSendingAverageNeckAngle);

    if (!records || records.length === 0) {
      throw new Error("No records found for this user");
    }

    const sumOfAngles = records.reduce((sum, record) => sum + record.angle, 0);
    let averageAngle = Math.round((sumOfAngles / NeckAngleService.numberOfRecordPostBeforeSendingAverageNeckAngle) * 10) / 10;

    if (isNaN(averageAngle)) averageAngle = 0;

    const user = await AppUser.findById(userId);
    if (user) {
      user.responseRate = 100 - (100 * (90 - averageAngle) / 90);
      await user.save();
    }

    return averageAngle;
  }

  static async sendPushNotificationMessageForAverageNeckAngle(
    notificationPayload: SendAverageNeckAnglePushNotificationViewModel
  ): Promise<boolean> {
    const appUsers = await AppUser.find();

    for (const appUser of appUsers) {
      if (!appUser.fcmToken) continue;

      let averageNeckAngle: number;
      try {
        averageNeckAngle = await this.calculateAverageOfLastSetNeckAngles(appUser._id.toString());
      } catch (error: any) {
        logger.info(error.message);
        continue;
      }

      appUser.notificationCount ??= 0;
      appUser.prompt ??= this.defaultPrompt;

      if (appUser.notificationCount > appUser.prompt) {
        NeckAngleService.scheduleResetNotificationCount(appUser._id.toString());
      }

      const [title, body] = await Utils.compareAverageNeckAngle(averageNeckAngle);
      const pushNotificationModel = {
        to: appUser.fcmToken,
        title,
        body,
      };

      const sent = await PushNotificationDriver.sendPushNotification(pushNotificationModel);
      if (sent) {
        appUser.notificationCount++;

        const responseRate = new ResponseRate({
          appUserId: appUser._id,
          dateCreated: new Date(),
          prompt: 1,
          response: 0,
        });

        await responseRate.save();
      }

      await appUser.save();
    }

    return true;
  }

  static async postRandomBatchNeckAngleRecordForTestAsync(
    model: AutomatePostNeckAngleRecordsViewModel
  ): Promise<boolean> {
    if (model.numberOfRecords > 30) {
      throw new CustomException('The maximum number of records allowed is 30 per request');
    }

    const neckAngleRecords: INeckAngleRecord[] = [];
    const random = () => Math.floor(Math.random() * (90 - 10 + 1)) + 10;

    for (let i = 0; i < model.numberOfRecords; i++) {
      const angle = random();
      const start = new Date(model.startDate);
      const end = new Date(model.endDate);
      const timeSpanMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      const randomMinutes = Math.floor(Math.random() * timeSpanMinutes);
      const randomDate = new Date(start.getTime() + randomMinutes * 60 * 1000);

      const record = new NeckAngleRecordModel({
        appUserId: model.appUserId,
        angle,
        craniumVertebralAngle: Calculator.getCraniumVertebralAngleFromNeckAngle(angle),
        dateTimeRecorded: randomDate,
        counter: 0,
      });

      neckAngleRecords.push(record);
    }

    await NeckAngleRecordModel.insertMany(neckAngleRecords);
    return true;
  }

  // Optional: Define defaultPrompt if needed
  static defaultPrompt = 5;
  static scheduleResetNotificationCount(userId: string): void {
  throw new Error('Function not implemented.');
  }

  // static async calculateAverageOfLastWeekOrDay(
  //   userId: string,
  //   frequency: GOAL_FREQUENCY,
  //   dateCreated: Date,
  //   goalId: string
  // ): Promise<boolean> {
  //   try {
  //     let average = 0;
  
  //     let startDate: Date;
  //     let endDate: Date = DateLibrary.getCurrentDateTime();
  
  //     if (frequency === GOAL_FREQUENCY.DAILY) {
  //       startDate = DateLibrary.getYesterdayDateTime();
  //     } else if (frequency === GOAL_FREQUENCY.WEEKLY) {
  //       startDate = DateLibrary.getLastWeekDateTime();
  //     } else {
  //       throw new Error("Invalid Goal Frequency");
  //     }
  
  //     const records = await NeckAngleRecordModel.find({
  //       appUserId: new Types.ObjectId(userId),
  //       dateTimeRecorded: {
  //         $gte: startDate,
  //         $lte: endDate,
  //       },
  //     }).lean();
  
  //     if (records.length > 0) {
  //       average = records.reduce((sum, r) => sum + r.angle, 0) / records.length;
  //     }
  
  //     const goal = await Goal.findById(goalId);
  //     if (!goal) return false;
  
  //     let complianceInPercentage =
  //       average >= goal.targetedAverageNeckAngle
  //         ? 100
  //         : Math.round((average / goal.targetedAverageNeckAngle) * 100 * 10) / 10;
  
  //     complianceInPercentage = complianceInPercentage > 100 ? 100 : complianceInPercentage;
  
  //     if (isNaN(complianceInPercentage)) complianceInPercentage = 0;
  
  //     const report = new GoalCycleCompletionReport({
  //       actualAverageNeckAngle: isNaN(average)
  //         ? 0
  //         : Math.round(average * 10) / 10,
  //       complianceInPercentage,
  //       dateOfConcludedCycle: DateLibrary.getCurrentDateTime(),
  //       goalId: new Types.ObjectId(goalId),
  //     });
  
  //     await report.save();
  
  //     const userFCMToken = await getFCMTokenById(userId); // implement separately
  
  //     if (userFCMToken && userFCMToken.trim() !== "") {
  //       const pushNotificationModel = {
  //         to: userFCMToken,
  //         title: "Your set goal",
  //         body: `Hi, you scored ${Math.round(report.complianceInPercentage * 10) / 10}/100`,
  //       };
  
  //       await PushNotificationDriver.sendPushNotification(pushNotificationModel); // implement separately
  //     } else {
  //       throw new Error("User does not have an FCM Token");
  //     }
  
  //     return true;
  //   } catch (err) {
  //     console.error("Error in calculateAverageOfLastWeekOrDay:", err);
  //     throw err;
  //   }
  // }
}

