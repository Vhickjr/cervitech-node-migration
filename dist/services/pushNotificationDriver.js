"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationDriver = void 0;
const axios_1 = __importDefault(require("axios"));
const CerviTechDbContext_1 = require("../config/CerviTechDbContext");
const applicationConstants_1 = require("../utils/applicationConstants");
const AppUser_1 = __importDefault(require("../models/AppUser"));
class PushNotificationDriver {
    constructor(logger, configuration, cerviTechDbContext = CerviTechDbContext_1.CerviTechDbContext) {
        this.db = CerviTechDbContext_1.CerviTechDbContext;
        this.logger = logger;
        this.config = configuration;
        this.FCMApiUrl = applicationConstants_1.ApplicationConstant.ENV_FCM_API_URL;
        this.FCMServerKey = applicationConstants_1.ApplicationConstant.ENV_FCM_SERVER_KEY;
        this.db = cerviTechDbContext;
    }
    async sendPushNotification(model) {
        try {
            const appUserRepo = CerviTechDbContext_1.CerviTechDbContext.getRepository(AppUser_1.default);
            const user = await appUserRepo.findOne({ where: { fcmToken: model.to } });
            if (user && !user.allowPushNotifications) {
                return true;
            }
            const senderId = 'xxx';
            const deviceId = model.to;
            const pushNotificationDTO = {
                to: deviceId,
                priority: 'high',
                notification: {
                    sound: 'default',
                    title: model.title,
                    body: model.body,
                },
                data: {
                    sound: 'default',
                    title: model.title,
                    body: model.body,
                },
            };
            const response = await axios_1.default.post(`${this.FCMApiUrl}/fcm/send`, pushNotificationDTO, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `key=${this.FCMServerKey}`,
                    'Sender': `id=${senderId}`,
                },
            });
            return true;
        }
        catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }
}
exports.PushNotificationDriver = PushNotificationDriver;
