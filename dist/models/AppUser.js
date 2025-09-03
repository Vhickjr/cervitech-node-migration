"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mobileChannel_1 = require("../enums/mobileChannel");
const NeckAngleRecord_1 = require("./NeckAngleRecord");
const Goal_1 = require("./Goal");
const AppUserSchema = new mongoose_1.Schema({
    fcmToken: { type: String },
    username: { type: String, required: true, unique: true },
    lastLoginDateTime: { type: Date, default: Date.now },
    allowPushNotifications: { type: Boolean, default: true },
    hasPaid: { type: Boolean, default: false },
    isGoalOn: { type: Boolean, default: false },
    responseRate: { type: Number, default: 0 },
    notificationResponse: { type: Number, required: false },
    neckAngleRecords: {
        type: [NeckAngleRecord_1.NeckAngleRecordSchema],
        default: [],
    },
    goals: {
        type: [Goal_1.GoalSchema],
        default: [],
    },
    mobileChannel: {
        type: String,
        enum: Object.values(mobileChannel_1.MOBILE_CHANNEL),
        default: mobileChannel_1.MOBILE_CHANNEL.OTHER,
    },
    prompt: { type: Number, required: false },
    notificationCount: { type: Number, required: false },
});
const AppUser = mongoose_1.default.models.AppUser || mongoose_1.default.model('AppUser', AppUserSchema);
exports.default = AppUser;
