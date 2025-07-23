import { Schema } from 'mongoose';
export const GoalCycleCompletionReportSchema = new Schema({
    actualAverageNeckAngle: { type: Number, required: true },
    complianceInPercentage: { type: Number, required: true },
    dateOfConcludedCycle: { type: Date, required: true },
});
