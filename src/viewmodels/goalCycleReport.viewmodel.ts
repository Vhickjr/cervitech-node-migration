export interface GoalCycleReportViewModel {
  id: number;
  appUserId: number;
  frequency: string;
  targetedAverageNeckAngle?: number;
  actualAverageNeckAngle?: number;
  complianceInPercentage?: number;
  colorTag: string;
  dateOfConcludedCycle?: Date;
  dayOfConcludedCycle: string;
}
