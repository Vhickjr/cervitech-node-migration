"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeckAngleRecordModel = exports.NeckAngleRecordSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
exports.NeckAngleRecordSchema = new mongoose_1.Schema({
    appUserId: { type: String, ref: 'User', required: true },
    angle: { type: Number, required: true },
    craniumVertebralAngle: { type: Number, required: true },
    dateTimeRecorded: { type: Date, required: true },
    counter: { type: Number, required: true },
});
exports.NeckAngleRecordModel = mongoose_2.default.model('NeckAngleRecord', exports.NeckAngleRecordSchema);
