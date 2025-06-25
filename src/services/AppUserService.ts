import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
//1. Import AppUser from the actual MongoDB model
import AppUser from "../models/User"; 

export const updatePictureUrlAsync = async (update: PictureUrlUpdateViewModel): Promise<boolean> => {
  if (!update || update.userId < 1) {
    throw new Error("UserId not provided");
  }

  //2. user is of type User but im not sure if User model exists yet
    const user = await AppUser.findById(update.userId);

  if (!user) {
    throw new Error("This user cannot be retrieved at the moment. Please contact support.");
  }

  user.pictureUrl = update.pictureUrl ?? user.pictureUrl;


  await new Promise(resolve => setTimeout(resolve, 500));

  return true;
};