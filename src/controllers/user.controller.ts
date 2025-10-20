import { Request, Response } from "express";
import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
import { AppUserService } from "../services/appUserServices/appUserService.service";
import { GetUserDataService } from "../services/appUserServices/getUserData";
import { FCMTokenService } from "../services/appUserServices/fcmToken.service";
import { DataResult } from "../utils/dataResult";
import { logger } from "../utils/logger";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CustomException } from "../utils/customException";


export class UserController {
  static async updatePictureUrl(req: Request, res: Response): Promise<void> {
    const updateViewModel: PictureUrlUpdateViewModel = req.body;

    try {
      if (!updateViewModel.userId || !updateViewModel.pictureUrl) {
        res.status(400).json({
          success: false,
          message: "User ID and Picture URL are required.",
        });
        return;
      }

      const result = await AppUserService.updatePictureUrlAsync(updateViewModel);
      if (!result) {
        res.status(404).json({
          success: false,
          message: "User not found or picture could not be updated.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully.",
      });
    } catch (error: any) {
      logger.error("UpdatePictureUrl Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  static async updateSubscription(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      const result = await AppUserService.updateSubscriptionAsync(id);

      res.status(200).json({
        success: true,
        message: "Subscription updated successfully.",
      });
    } catch (error: any) {
      logger.error("UpdateSubscription Error:", error.message);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update subscription.",
      });
    }
  }

  static async deleteById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      const result = await AppUserService.deleteByIdAsync(id);
      if (!result) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    } catch (error: any) {
      logger.error("DeleteById Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to delete user.",
      });
    }
  }

  static async deleteMyAccount(req: Request, res: Response): Promise<void> {
    const email = req.query.email as string;

    try {
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email is required.",
        });
        return;
      }

      const result = await AppUserService.deleteAccountRequest(email);
      if (!result) {
        res.status(404).json({
          success: false,
          message: "Account not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Account deletion request submitted successfully.",
      });
    } catch (error: any) {
      logger.error("DeleteMyAccount Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  static async confirmDeleteMyAccount(req: Request, res: Response): Promise<void> {
    const email = req.query.email as string;
    const token = req.query.token as string;

    try {
      const result = await AppUserService.deleteByEmailAsync(email);
      if (result) {
        res.status(200).json({
          success: true,
          message: "Account deleted successfully.",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid token or account not found.",
        });
      }
    } catch (error: any) {
      logger.error("ConfirmDeleteMyAccount Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to confirm account deletion.",
      });
    }
  }

  static async deleteAll(req: Request, res: Response): Promise<void> {
    try {
      await AppUserService.deleteAllAsync();
      res.status(200).json({
        success: true,
        message: "All accounts deleted successfully.",
      });
    } catch (error: any) {
      logger.error("DeleteAll Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to delete all accounts.",
      });
    }
  }

  static async toggleAllowPushNotifications(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
      return;
    }

    try {
      await AppUserService.toggleAllowPushNotificationsAsync(id);
      res.status(200).json({
        success: true,
        message: "Push notification preference updated successfully.",
      });
    } catch (error: any) {
      logger.error("ToggleAllowPushNotifications Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to toggle push notifications.",
      });
    }
  }

  static async getResponseRate(req: Request, res: Response) {
    const id = req.query.id as string;
    const dateStr = req.query.date as string;

    try {
      if (!id || !dateStr || isNaN(Date.parse(dateStr))) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing user ID/date.",
        });
      }

      const date = new Date(dateStr);
      const result = await AppUserService.getResponseRateAsync(id, date);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error("GetResponseRate Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch response rate.",
      });
    }
  }

  static async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;
      const updateRequest = req.body;

      const updatedUser = await AppUserService.updateUser(userId!, updateRequest);

      res.status(200).json({
        success: true,
        message: "User profile updated successfully.",
        data: updatedUser,
      });
    } catch (err: any) {
      logger.error("UpdateUser Error:", err.message);
      res.status(400).json({
        success: false,
        message: err.message || "Failed to update user.",
      });
    }
  }

  static async getByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string") {
        res.status(400).json({
          success: false,
          message: "Email is required and must be a string.",
        });
        return;
      }

      const user = await GetUserDataService.getByEmail(email);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      logger.error("GetByEmail Error:", error.message);
      if (error instanceof CustomException) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
      }
    }
  }

  static async getAllowPushNotificationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;

      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "A valid user ID is required.",
        });
        return;
      }

      const allowPush = await GetUserDataService.getAllowPushNotificationStatus(id);
      res.status(200).json({
        success: true,
        data: { allowPushNotifications: allowPush },
      });
    } catch (error: any) {
      logger.error("GetAllowPushNotificationStatus Error:", error.message);
      res.status(
        error instanceof CustomException ? 404 : 500
      ).json({
        success: false,
        message:
          error instanceof CustomException
            ? error.message
            : "Internal server error.",
      });
    }
  }

  static async getFCMTokenByUsername(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;

      if (!username || typeof username !== "string") {
          res.status(400).json({
          success: false,
          message: "Username is required and must be a string.",
        });
        return;
      }

      const service = new GetUserDataService();
      const token = await service.getFCMTokenByUsername(username);

      res.status(200).json({
        success: true,
        data: { fcmToken: token },
      });
    } catch (error: any) {
      logger.error("GetFCMTokenByUsername Error:", error.message);
      res.status(
        error instanceof CustomException ? 404 : 500
      ).json({
        success: false,
        message:
          error instanceof CustomException
            ? error.message
            : "Internal server error.",
      });
    }
  }

  static async updateFCMToken(req: Request, res: Response): Promise<void> {
    try {
      const { fcmToken, _id } = req.body;

      if (!fcmToken || !_id || typeof fcmToken !== "string" || typeof _id !== "string") {
          res.status(400).json({
          success: false,
          message: "Invalid request. Provide valid fcmToken and user ID.",
        });
        return;
      }

      await FCMTokenService.updateFCMToken({ fcmToken, _id });

      res.status(200).json({
        success: true,
        message: "FCM token updated successfully.",
      });
    } catch (error: any) {
      logger.error("UpdateFCMToken Error:", error.message);
      res.status(
        error instanceof CustomException ? 400 : 500
      ).json({
        success: false,
        message:
          error instanceof CustomException
            ? error.message
            : "Internal server error.",
      });
    }
  }
}
