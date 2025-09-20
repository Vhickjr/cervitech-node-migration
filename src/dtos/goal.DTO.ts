import { GOAL_FREQUENCY } from '../enums/goalFrequency';

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

export interface GoalCycleReportViewModel {
  id: number;
  appUserId: string;
  frequency: string;
  targetedAverageNeckAngle?: number;
  actualAverageNeckAngle?: number;
  complianceInPercentage?: number;
  colorTag: string;
  dateOfConcludedCycle?: Date;
  dayOfConcludedCycle: string;
}

