export interface ResponseRateViewModel {
  appUserId: string;
  responseRate: number;
  totalPrompts: number;
  totalResponses: number;
  activity: Activity[];
}

export interface Activity {
  hour: number;
  prompts: number;
  responses: number;
  activityPercentage: number;
}
