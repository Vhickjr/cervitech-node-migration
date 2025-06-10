import { Schema, Document } from 'mongoose';
import {
  GoalCycleCompletionReportSchema,
  IGoalCycleCompletionReport,
} from './GoalCycleCompletionReport';

export interface IGoal extends Document {
  dateSet: Date;
  targetedAverageNeckAngle: number;
  frequency: string;
  goalCycleCompletionReports: IGoalCycleCompletionReport[];
}

export const GoalSchema = new Schema<IGoal>({
  dateSet: { type: Date, required: true },
  targetedAverageNeckAngle: { type: Number, required: true },
  frequency: { type: String, required: true },
  goalCycleCompletionReports: {
    type: [GoalCycleCompletionReportSchema],
    default: [],
  },
});
