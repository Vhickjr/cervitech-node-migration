"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeckAngleService = void 0;
const NeckAngleRecord_1 = require("../models/NeckAngleRecord");
const computations_1 = require("../helpers/computations");
const AppUser_1 = __importDefault(require("../models/AppUser"));
const CustomException_1 = require("../helpers/CustomException");
const logger_1 = require("../utils/logger");
const ResponseRate_1 = __importDefault(require("../models/ResponseRate"));
const pushNotificationDriver_1 = require("./pushNotificationDriver");
const utils_1 = require("../helpers/utils");
const calculator_1 = require("../helpers/calculator");
class NeckAngleService {
    static async postBatchNeckAngleRecordAsync(neckAngleModel) {
        try {
            for (const record of neckAngleModel.neckAngleRecords) {
                const appUser = await AppUser_1.default.findOne({ id: record.appUserId });
                if (!appUser) {
                    logger_1.logger.warn(`AppUser ${record.appUserId} not found, skipping.`);
                    continue;
                }
                const lastRecord = await NeckAngleRecord_1.NeckAngleRecordModel
                    .findOne({ appUserId: record.appUserId })
                    .sort({ counter: -1 });
                const counter = (lastRecord?.counter ?? 0) + 1;
                const craniumVertebralAngle = (0, computations_1.getCraniumVertebralAngleFromNeckAngle)(record.angle);
                const neckAngleRecord = new NeckAngleRecord_1.NeckAngleRecordModel({
                    appUserId: record.appUserId,
                    craniumVertebralAngle,
                    counter,
                    dateTimeRecorded: new Date(record.dateTimeRecorded),
                    angle: record.angle,
                });
                await neckAngleRecord.save();
                if (appUser.prompt && counter % appUser.prompt === 0) {
                    const averageNeckAngle = await this.calculateAverageOfLastSetNeckAngles(record.appUserId);
                    const notificationPayload = {
                        userId: record.appUserId,
                        averageNeckAngle,
                    };
                    await this.sendPushNotificationMessageForAverageNeckAngle(notificationPayload);
                }
            }
            return true;
        }
        catch (error) {
            logger_1.logger.error(error.message || 'Unhandled exception');
            throw error;
        }
    }
    static async calculateAverageOfLastSetNeckAngles(userId) {
        const records = await NeckAngleRecord_1.NeckAngleRecordModel.find({ appUserId: userId })
            .sort({ _id: -1 })
            .limit(NeckAngleService.numberOfRecordPostBeforeSendingAverageNeckAngle);
        if (!records || records.length === 0) {
            throw new Error("No records found for this user");
        }
        const sumOfAngles = records.reduce((sum, record) => sum + record.angle, 0);
        let averageAngle = Math.round((sumOfAngles / NeckAngleService.numberOfRecordPostBeforeSendingAverageNeckAngle) * 10) / 10;
        if (isNaN(averageAngle))
            averageAngle = 0;
        const user = await AppUser_1.default.findById(userId);
        if (user) {
            user.responseRate = 100 - (100 * (90 - averageAngle) / 90);
            await user.save();
        }
        return averageAngle;
    }
    static async sendPushNotificationMessageForAverageNeckAngle(notificationPayload) {
        const appUsers = await AppUser_1.default.find();
        for (const appUser of appUsers) {
            if (!appUser.fcmToken)
                continue;
            let averageNeckAngle;
            try {
                averageNeckAngle = await this.calculateAverageOfLastSetNeckAngles(appUser._id.toString());
            }
            catch (error) {
                logger_1.logger.info(error.message);
                continue;
            }
            appUser.notificationCount ?? (appUser.notificationCount = 0);
            appUser.prompt ?? (appUser.prompt = this.defaultPrompt);
            if (appUser.notificationCount > appUser.prompt) {
                NeckAngleService.scheduleResetNotificationCount(appUser._id.toString());
            }
            const [title, body] = await utils_1.Utils.compareAverageNeckAngle(averageNeckAngle);
            const pushNotificationModel = {
                to: appUser.fcmToken,
                title,
                body,
            };
            const sent = await pushNotificationDriver_1.PushNotificationDriver.sendPushNotification(pushNotificationModel);
            if (sent) {
                appUser.notificationCount++;
                const responseRate = new ResponseRate_1.default({
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
    static async postRandomBatchNeckAngleRecordForTestAsync(model) {
        if (model.numberOfRecords > 30) {
            throw new CustomException_1.CustomException('The maximum number of records allowed is 30 per request');
        }
        const neckAngleRecords = [];
        const random = () => Math.floor(Math.random() * (90 - 10 + 1)) + 10;
        for (let i = 0; i < model.numberOfRecords; i++) {
            const angle = random();
            const start = new Date(model.startDate);
            const end = new Date(model.endDate);
            const timeSpanMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
            const randomMinutes = Math.floor(Math.random() * timeSpanMinutes);
            const randomDate = new Date(start.getTime() + randomMinutes * 60 * 1000);
            const record = new NeckAngleRecord_1.NeckAngleRecordModel({
                appUserId: model.appUserId,
                angle,
                craniumVertebralAngle: calculator_1.Calculator.getCraniumVertebralAngleFromNeckAngle(angle),
                dateTimeRecorded: randomDate,
                counter: 0,
            });
            neckAngleRecords.push(record);
        }
        await NeckAngleRecord_1.NeckAngleRecordModel.insertMany(neckAngleRecords);
        return true;
    }
    static scheduleResetNotificationCount(userId) {
        throw new Error('Function not implemented.');
    }
}
exports.NeckAngleService = NeckAngleService;
NeckAngleService.numberOfRecordPostBeforeSendingAverageNeckAngle = parseInt(process.env.ENV_NUMBER_OF_RECORD_POST_BEFORE_SENDING_AVERAGE_NECK_ANGLE || '0', 10);
// Optional: Define defaultPrompt if needed
NeckAngleService.defaultPrompt = 5;
