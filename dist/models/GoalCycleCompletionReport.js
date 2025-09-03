"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalCycleCompletionReport = exports.GoalCycleCompletionReportSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
exports.GoalCycleCompletionReportSchema = new mongoose_1.Schema({
    actualAverageNeckAngle: { type: Number, required: true },
    complianceInPercentage: { type: Number, required: true },
    dateOfConcludedCycle: { type: Date, required: true },
});
exports.GoalCycleCompletionReport = mongoose_2.default.model('GoalCycleCompletionReport', exports.GoalCycleCompletionReportSchema);
