import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
//1. Import AppUser from the actual MongoDB model
import AppUser from "../viewmodels/AppUser"; 
import { SubscriptionUpdateViewModel } from "../viewmodels/SubscriptionUpdateViewModel";
import { CustomException } from "../helpers/CustomException";
import mongoose from "mongoose";

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

export const deleteByIdAsync = async (id: string): Promise<boolean> => {
  if (!id || id.trim().length === 0) {
    throw new CustomException("User ID not provided");
  }

  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomException("Invalid User ID format");
  }

  const user = await AppUser.findById(id);
  
  if (!user) {
    throw new CustomException("User does not exist");
  }

  await AppUser.findByIdAndDelete(id);
  
  // TODO: Send account deletion email (when mail service is implemented)  
  // await mailService.SendAccountDeletionMail(user.email.trim().toLowerCase(), user.username);
  
  return true;
};

export const deleteAccountRequestAsync = async (email: string): Promise<boolean> => {
  if (!email || email.trim().length === 0) {
    throw new CustomException("Email not provided");
  }

  const user = await AppUser.findOne({ email: email.toLowerCase().trim() });
  
  if (!user) {
    throw new CustomException("User does not exist");
  }

  // TODO: Generate token (when token service is implemented)
  // const token = await tokenGenerator.GetToken();
  
  // TODO: Send account deletion confirmation email (when mail service is implemented)
  // await mailService.SendAccountDeletionMail(email, user.username, token);
  
  return true;
};

export const deleteByEmailAsync = async (email: string): Promise<boolean> => {
  if (!email || email.trim().length === 0) {
    throw new CustomException("Email not provided");
  }

  const user = await AppUser.findOne({ email: email.toLowerCase().trim() });
  
  if (!user) {
    throw new CustomException("User does not exist");
  }

  await AppUser.findOneAndDelete({ email: email.toLowerCase().trim() });
  
  // TODO: Send account deletion email (when mail service is implemented)
  // await mailService.SendAccountDeletionMail(user.email.trim().toLowerCase(), user.username);
  
  return true;
};