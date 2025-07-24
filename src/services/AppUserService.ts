import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
//1. Import AppUser from the actual MongoDB model
import AppUser from "../viewmodels/AppUser"; 
import { SubscriptionUpdateViewModel } from "../viewmodels/SubscriptionUpdateViewModel";
import { CustomException } from "../helpers/CustomException";

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
    // FCMToken: user.FCMToken,
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

export const toggleAllowPushNotificationsAsync = async (userId: number): Promise<boolean> => {
  if (!userId || userId < 1) {
    throw new CustomException("UserId not provided");
  }

  const user = await AppUser.findById(userId);
  
  if (!user) {
    throw new CustomException("cannot find user");
  }

  user.allowPushNotifications = !user.allowPushNotifications;

  await user.save();

  return true;
};