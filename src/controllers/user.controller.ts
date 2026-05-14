import { TokenUtil } from "../utils/token.util";
import { Request, Response } from "express";
import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
import { AppUserService } from "../services/appUserServices/appUserService.service";
import { GetUserDataService } from "../services/appUserServices/getUserData";
import { FCMTokenService } from "../services/appUserServices/fcmToken.service";
import { logger } from "../utils/logger";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import TokenBlacklist from "../models/TokenBlacklist";
import { CustomException } from "../utils/customException";

export class UserController {
  // -------------------------
  // Update profile picture
  // -------------------------
  static async updatePictureUrl(req: Request, res: Response): Promise<void> {
    const updateViewModel: PictureUrlUpdateViewModel = {
      userId: req.body.UserId ?? req.body.userId ?? req.body.Id ?? req.body.id,
      pictureUrl: req.body.PictureUrl ?? req.body.pictureUrl,
    };

    if (!updateViewModel.userId || !updateViewModel.pictureUrl) {
      res.status(400).json({ success: false, message: "User ID and Picture URL are required." });
      return;
    }

    try {
      const result = await AppUserService.updatePictureUrlAsync(updateViewModel);
      if (!result) {
        res.status(404).json({ success: false, message: "User not found or picture could not be updated." });
        return;
      }

      res.status(200).json({ success: true, message: "Profile picture updated successfully." });
    } catch (error: any) {
      logger.error("UpdatePictureUrl Error:", error.message);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  // -------------------------
  // Update subscription
  // -------------------------
  static async updateSubscription(req: Request, res: Response): Promise<void> {
    const id = req.params.id ?? req.body.Id ?? req.body.id;
    if (!id) {
      res.status(400).json({ success: false, message: "User ID is required." });
      return;
    }

    try {
      await AppUserService.updateSubscriptionAsync(id);
      res.status(200).json({ success: true, message: "Subscription updated successfully." });
    } catch (error: any) {
      logger.error("UpdateSubscription Error:", error.message);
      res.status(400).json({ success: false, message: error.message || "Failed to update subscription." });
    }
  }

  // -------------------------
  // Delete user by ID
  // -------------------------
  static async deleteById(req: Request, res: Response): Promise<void> {
    const id = req.params.id ?? req.query.id;
    if (!id) {
      res.status(400).json({ success: false, message: "User ID is required." });
      return;
    }

    try {
      const result = await AppUserService.deleteByIdAsync(id);
      if (!result) {
        res.status(404).json({ success: false, message: "User not found." });
        return;
      }

      res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error: any) {
      logger.error("DeleteById Error:", error.message);
      res.status(500).json({ success: false, message: "Failed to delete user." });
    }
  }

  // -------------------------
  // Request account deletion (legacy compatible)
  // -------------------------
  static async deleteMyAccount(req: Request, res: Response): Promise<void> {
    const email = req.query.email as string ?? req.body.Email ?? req.body.email;
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required." });
      return;
    }

    try {
      const result = await AppUserService.deleteAccountRequest(email);
      if (!result) {
        res.status(404).json({ success: false, message: "Account not found." });
        return;
      }

      res.status(200).json({ success: true, message: "Account deletion request submitted successfully." });
    } catch (error: any) {
      logger.error("DeleteMyAccount Error:", error.message);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  // -------------------------
  // Confirm deletion via token
  // -------------------------
  static async confirmDeleteMyAccount(req: Request, res: Response): Promise<void> {
    const token = req.query.token as string ?? req.body.Token ?? req.body.token;
    if (!token) {
      res.status(400).json({ success: false, message: "Token is required." });
      return;
    }

    try {
      const blacklisted = await TokenBlacklist.findOne({ token });
      if (blacklisted) {
        res.status(400).json({ success: false, message: "This token has already been used or is invalid." });
        return;
      }

      const decoded = TokenUtil.verifyToken(token);
      if (!decoded?.userId) {
        res.status(400).json({ success: false, message: "Invalid or expired token." });
        return;
      }

      const result = await AppUserService.deleteByIdAsync(decoded.userId);
      await TokenBlacklist.create({ token, expiresAt: new Date() });

      if (result) res.status(200).json({ success: true, message: "Account deleted successfully." });
      else res.status(404).json({ success: false, message: "Account not found." });
    } catch (error: any) {
      logger.error("ConfirmDeleteMyAccount Error:", error.message);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  // -------------------------
  // Delete all users
  // -------------------------
  static async deleteAll(req: Request, res: Response): Promise<void> {
    try {
      await AppUserService.deleteAllAsync();
      res.status(200).json({ success: true, message: "All accounts deleted successfully." });
    } catch (error: any) {
      logger.error("DeleteAll Error:", error.message);
      res.status(500).json({ success: false, message: "Failed to delete all accounts." });
    }
  }

  // -------------------------
  // Toggle push notification preference
  // -------------------------
  static async toggleAllowPushNotifications(req: Request, res: Response): Promise<void> {
    const id = req.params.id ?? req.body.Id ?? req.body.id;
    if (!id) {
      res.status(400).json({ success: false, message: "User ID is required." });
      return;
    }

    try {
      await AppUserService.toggleAllowPushNotificationsAsync(id);
      res.status(200).json({ success: true, message: "Push notification preference updated successfully." });
    } catch (error: any) {
      logger.error("ToggleAllowPushNotifications Error:", error.message);
      res.status(500).json({ success: false, message: "Failed to toggle push notifications." });
    }
  }

  // -------------------------
  // Get response rate
  // -------------------------
  static async getResponseRate(req: Request, res: Response) {
    const id = req.query.id as string ?? req.body.Id ?? req.body.id;
    const dateStr = req.query.date as string ?? req.body.date;

    if (!id || !dateStr || isNaN(Date.parse(dateStr))) {
      res.status(400).json({ success: false, message: "Invalid or missing user ID/date." });
      return;
    }

    try {
      const date = new Date(dateStr);
      const result = await AppUserService.getResponseRateAsync(id, date);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error("GetResponseRate Error:", error.message);
      res.status(500).json({ success: false, message: "Failed to fetch response rate." });
    }
  }

  // -------------------------
  // Update user profile
  // -------------------------
static async updateUser(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId ?? req.body.Id ?? req.body.id ?? req.body._id;
  if (!userId) {
    res.status(400).json({ success: false, message: "User ID is required." });
    return;
  }

  try {
    const normalizedUpdate: {
      email?: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      telephone?: string;
    } = {
      email: req.body.email ?? req.body.Email,
      firstName: req.body.firstName ?? req.body.FirstName,
      lastName: req.body.lastName ?? req.body.LastName,
      username: req.body.username ?? req.body.Username,
      telephone: req.body.telephone ?? req.body.Telephone,
    };

    const updatedUser = await AppUserService.updateUser(userId, normalizedUpdate);
    res.status(200).json({ success: true, message: "User profile updated successfully.", data: updatedUser });
  } catch (err: any) {
    logger.error("UpdateUser Error:", err.message);
    res.status(400).json({ success: false, message: err.message || "Failed to update user." });
  }
}


  // -------------------------
  // Get user by email
  // -------------------------
  static async getByEmail(req: Request, res: Response): Promise<void> {
    const email = req.body.Email ?? req.body.email ?? req.query.email;
    if (!email || typeof email !== "string") {
      res.status(400).json({ success: false, message: "Email is required and must be a string." });
      return;
    }

    try {
      const user = await GetUserDataService.getByEmail(email);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      logger.error("GetByEmail Error:", error.message);
      if (error instanceof CustomException) res.status(404).json({ success: false, message: error.message });
      else res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  // Get user profile by Id
  static async fetch_user_profile(req : Request, res : Response) : Promise<void>{
    try {
      const id = req.params.id ?? req.query.id;

      if (!id || typeof id !== "string"){
        res.status(400).json({ success: false, message: "Id is required and must be a string." });
        return;
      }

      const user = await GetUserDataService.getById(id);
      res.status(200).json({success : true,data : user});
    } catch (error : any) {
      logger.error("GetById Error:", error.message);
      if (error instanceof CustomException) res.status(404).json({ success: false, message: error.message });
      else res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  // -------------------------
  // Get push notification status
  // -------------------------
  static async getAllowPushNotificationStatus(req: Request, res: Response): Promise<void> {
    const id = req.body.Id ?? req.body.id;
    if (!id || typeof id !== "string") {
      res.status(400).json({ success: false, message: "A valid user ID is required." });
      return;
    }

    try {
      const allowPush = await GetUserDataService.getAllowPushNotificationStatus(id);
      res.status(200).json({ success: true, data: { allowPushNotifications: allowPush } });
    } catch (error: any) {
      logger.error("GetAllowPushNotificationStatus Error:", error.message);
      res.status(error instanceof CustomException ? 404 : 500).json({ success: false, message: error instanceof CustomException ? error.message : "Internal server error." });
    }
  }

  // -------------------------
  // Get FCM token by username
  // -------------------------
  static async getFCMTokenByUsername(req: Request, res: Response): Promise<void> {
    const username = req.body.Username ?? req.body.username;
    if (!username || typeof username !== "string") {
      res.status(400).json({ success: false, message: "Username is required and must be a string." });
      return;
    }

    try {
      const service = new GetUserDataService();
      const token = await service.getFCMTokenByUsername(username);
      res.status(200).json({ success: true, data: { fcmToken: token } });
    } catch (error: any) {
      logger.error("GetFCMTokenByUsername Error:", error.message);
      res.status(error instanceof CustomException ? 404 : 500).json({ success: false, message: error instanceof CustomException ? error.message : "Internal server error." });
    }
  }

  // -------------------------
  // Update FCM token
  // -------------------------
  static async updateFCMToken(req: Request, res: Response): Promise<void> {
    const fcmToken = req.body.FCMToken ?? req.body.fcmToken ?? req.body.token;
    const _id = req.body.UserId ?? req.body.userId ?? req.body._id;

    if (!fcmToken || !_id || typeof fcmToken !== "string" || typeof _id !== "string") {
      res.status(400).json({ success: false, message: "Invalid request. Provide valid fcmToken and user ID." });
      return;
    }

    try {
      await FCMTokenService.updateFCMToken({ fcmToken, _id });
      res.status(200).json({ success: true, message: "FCM token updated successfully." });
    } catch (error: any) {
      logger.error("UpdateFCMToken Error:", error.message);
      res.status(error instanceof CustomException ? 400 : 500).json({ success: false, message: error instanceof CustomException ? error.message : "Internal server error." });
    }
  }
}
