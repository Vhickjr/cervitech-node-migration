"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = exports.GoalSchema = void 0;
const mongoose_1 = require("mongoose");
const GoalCycleCompletionReport_1 = require("./GoalCycleCompletionReport");
const mongoose_2 = __importDefault(require("mongoose"));
exports.GoalSchema = new mongoose_1.Schema({
    dateSet: { type: Date, required: true },
    targetedAverageNeckAngle: { type: Number, required: true },
    frequency: { type: String, required: true },
    goalCycleCompletionReports: {
        type: [GoalCycleCompletionReport_1.GoalCycleCompletionReportSchema],
        default: [],
    },
});
exports.Goal = mongoose_2.default.models.Goal || mongoose_2.default.model('Goal', exports.GoalSchema);
