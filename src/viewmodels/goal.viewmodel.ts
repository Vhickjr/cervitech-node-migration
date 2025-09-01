import { GOAL_FREQUENCY } from '../enums/goalFrequency';
import { GoalCycleReportViewModel } from './goalCycleReport.viewmodel';

export interface TurnOnGoalViewModel {
  appUserId: string;
  targetedAverageNeckAngle: number;
}


export interface SetGoalViewModel {
  appUserId: string;
  targetedAverageNeckAngle: number;
  frequency: GOAL_FREQUENCY;
  goalCycleCompletionReports: GoalCycleReportViewModel[];
}
