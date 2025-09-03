"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUserService = void 0;
const AppUser_1 = __importDefault(require("../viewmodels/AppUser"));
const ResponseRateViewModel_1 = __importDefault(require("../viewmodels/ResponseRateViewModel"));
const CustomException_1 = require("../helpers/CustomException");
const NeckAngleRecord_1 = require("../models/NeckAngleRecord");
const dateLibrary_1 = require("../helpers/dateLibrary");
const Goal_1 = require("../models/Goal");
const GoalCycleCompletionReport_1 = require("../models/GoalCycleCompletionReport");
const pushNotificationDriver_1 = require("./pushNotificationDriver");
const logger_1 = require("../utils/logger");
class AppUserService {
    static async updateSubscriptionAsync(userId) {
        try {
            if (!userId || userId.trim() === "") {
                throw new Error("UserId not provided");
            }
            const user = await AppUser_1.default.findById(userId);
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
        }
        catch (error) {
            logger_1.logger.error("Error in updateSubscriptionAsync:", error);
            throw new CustomException_1.CustomException("Error updating subscription.");
        }
    }
    static async updatePictureUrlAsync(update) {
        if (!update || update.userId < 1) {
            throw new Error("UserId not provided");
        }
        const user = await AppUser_1.default.findById(update.userId);
        if (!user) {
            throw new Error("This user cannot be retrieved at the moment. Please contact support.");
        }
        user.pictureUrl = update.pictureUrl ?? user.pictureUrl;
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
    static async getResponseRateAsync(userId, day) {
        try {
            const startOfDay = new Date(day);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(day);
            endOfDay.setHours(23, 59, 59, 999);
            const responseRates = await ResponseRateViewModel_1.default.find({
                appUserId: userId,
                dateCreated: { $gte: startOfDay, $lte: endOfDay }
            });
            const totalPrompts = responseRates.reduce((sum, r) => sum + (r.prompt || 0), 0);
            const totalResponses = responseRates.reduce((sum, r) => sum + (r.response || 0), 0);
            const groupedByHour = {};
            responseRates.forEach(entry => {
                const hour = new Date(entry.dateCreated).getHours();
                if (!groupedByHour[hour]) {
                    groupedByHour[hour] = { prompts: 0, responses: 0 };
                }
                groupedByHour[hour].prompts += entry.prompt || 0;
                groupedByHour[hour].responses += entry.response || 0;
            });
            const activity = Object.entries(groupedByHour).map(([hourStr, group]) => {
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
        }
        catch (error) {
            logger_1.logger.error("Error in getResponseRateAsync:", error);
            throw new CustomException_1.CustomException("Error retrieving response rate.");
        }
    }
    static async calculateAverageOfLastWeekOrDay(userId, frequency, dateCreated, goalId) {
        try {
            let records;
            if (frequency === 'DAILY') {
                records = await NeckAngleRecord_1.NeckAngleRecordModel.find({
                    appUserId: userId,
                    dateTimeRecorded: {
                        $gte: dateLibrary_1.DateLibrary.getYesterdayDateTime(),
                        $lte: dateLibrary_1.DateLibrary.getCurrentDateTime()
                    }
                });
            }
            else if (frequency === 'WEEKLY') {
                records = await NeckAngleRecord_1.NeckAngleRecordModel.find({
                    appUserId: userId,
                    dateTimeRecorded: {
                        $gte: dateLibrary_1.DateLibrary.getLastWeekDateTime(),
                        $lte: dateLibrary_1.DateLibrary.getCurrentDateTime()
                    }
                });
            }
            else {
                throw new CustomException_1.CustomException('Invalid Goal Frequency');
            }
            if (records.length === 0)
                return false;
            const average = records.reduce((sum, r) => sum + r.angle, 0) / records.length;
            const goal = await Goal_1.Goal.findById(goalId);
            if (!goal)
                return false;
            const compliance = average >= goal.targetedAverageNeckAngle
                ? 100
                : Math.min(100, Math.round((average / goal.targetedAverageNeckAngle) * 1000) / 10);
            const goalCycleReport = new GoalCycleCompletionReport_1.GoalCycleCompletionReport({
                actualAverageNeckAngle: isNaN(average) ? 0 : Math.round(average * 10) / 10,
                complianceInPercentage: isNaN(compliance) ? 0 : compliance,
                dateOfConcludedCycle: dateLibrary_1.DateLibrary.getCurrentDateTime(),
                goalId
            });
            await goalCycleReport.save();
            const userFCMToken = await this.getFCMTokenById(userId);
            if (!userFCMToken)
                throw new CustomException_1.CustomException('User does not have an FCM Token');
            const pushNotificationModel = {
                to: userFCMToken,
                title: 'Your set goal',
                body: `Hi, you scored ${goalCycleReport.complianceInPercentage}/100`
            };
            await pushNotificationDriver_1.PushNotificationDriver.sendPushNotification(pushNotificationModel);
            return true;
        }
        catch (error) {
            logger_1.logger.error(error instanceof CustomException_1.CustomException ? error.message : String(error));
            throw error;
        }
    }
    static async getFCMTokenById(id) {
        try {
            const user = await AppUser_1.default.findOne({ id }).exec();
            if (!user) {
                throw new CustomException_1.CustomException('User does not exist in our system');
            }
            return user.fcmToken;
        }
        catch (error) {
            logger_1.logger.error(error instanceof CustomException_1.CustomException ? error.message : String(error));
            throw error;
        }
    }
}
exports.AppUserService = AppUserService;
