import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
//1. Import AppUser from the actual MongoDB model
import AppUser from "../viewmodels/AppUser"; 
import { SubscriptionUpdateViewModel } from "../viewmodels/SubscriptionUpdateViewModel";
import { CustomException } from "../helpers/CustomException";
import { ResponseRateViewModel } from "../viewmodels/ResponseRateViewModel";
import ResponseRate from "../viewmodels/ResponseRateViewModel";
import { Activity } from "../viewmodels/Activity";

export const updatePictureUrlAsync = async (update: PictureUrlUpdateViewModel): Promise<boolean> => {
  if (!update || update.userId < 1) {
    throw new Error("UserId not provided");
  }

    const user = await AppUser.findById(update.userId);

  if (!user) {
    throw new Error("This user cannot be retrieved at the moment. Please contact support.");
  }

  user.pictureUrl = update.pictureUrl ?? user.pictureUrl;


  await new Promise(resolve => setTimeout(resolve, 500));

  return true;
};


export const updateSubscriptionAsync = async (userId: number) => {
  if (!userId || userId < 1) {
    throw new CustomException("UserId not provided");
  }

  const user = await AppUser.findById(userId);

  if (!user) {
    throw new CustomException("This user cannot be retrieved at the moment. Please contact support.");
  }

  user.hasPaid = true;

  await user.save(); // saves updated document

  // Build and return AppUserViewModel-like object
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    FCMToken: user.fcmToken,
    hasPaid: user.hasPaid,
    firstName: user.firstName,
    lastName: user.lastName,
    pictureUrl: user.pictureUrl,
    salt: user.salt,
    hash: user.hash,
    isGoalOn: user.isGoalOn,
    allowPushNotifications: user.allowPushNotifications,
    mobileChannel: user.mobileChannel,
    dateRegistered: user.dateRegistered?.toString(),
    responseRate: user.responseRate,
    lastLoginDateTime: user.lastLoginDateTime
  };
};


export const getResponseRateAsync = async (userId: string, day: Date): Promise<ResponseRateViewModel> => {
  try {
    // Set time boundaries for the day
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    // Query response rates for that user on that day
    const responseRates = await ResponseRate.find({
      appUserId: userId,
      dateCreated: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalPrompts = responseRates.reduce((sum: any, r: { prompt: any; }) => sum + (r.prompt || 0), 0);
    const totalResponses = responseRates.reduce((sum: number, r: { response: any; }) => sum + (r.response || 0), 0);

    // Group by hour
    const groupedByHour: Record<number, { prompts: number; responses: number }> = {};

    responseRates.forEach((entry) => {
      const hour = new Date(entry.dateCreated).getHours();

      if (!groupedByHour[hour]) {
        groupedByHour[hour] = { prompts: 0, responses: 0 };
      }

      groupedByHour[hour].prompts += entry.prompt || 0;
      groupedByHour[hour].responses += entry.response || 0;
    });

    const activity: Activity[] = Object.entries(groupedByHour).map(([hourStr, group]) => {
      const hour = parseInt(hourStr);
      const { prompts, responses } = group;
      const activityPercentage = prompts === 0 ? 0 : (responses / prompts) * 100;

      return { hour, prompts, responses, activityPercentage };
    });

    const responseRate = totalPrompts === 0 ? 0 : (totalResponses / totalPrompts) * 100;

    const rrvm: ResponseRateViewModel = {
      appUserId: userId,
      responseRate,
      totalPrompts,
      totalResponses,
      activity
    };

    return rrvm;

  } catch (err: any) {
    console.error("Error in getResponseRateAsync:", err.message);
    throw new CustomException("Error retrieving response rate.");
  }
};
