import { Request, Response } from "express";
import backofficeUserService from "../services/backofficeuser.service";
import { logger } from "../utils/logger";

class BackOfficeUserController {
  static async createUser(req: Request, res: Response) {
    try {
      const data = await backofficeUserService.create(req.body);
      logger.info("BackOffice user created successfully.", { user: req.body.username });

      res.status(201).json({
        success: true,
        message: "User created successfully.",
        data,
      });
    } catch (err: any) {
      logger.error("Create User Error", { error: err.message });
      res.status(500).json({
        success: false,
        message: "Failed to create user.",
        error: err.message,
      });
    }
  }

  static async loginController(req: Request, res: Response) {
    console.log("Login controller hit");

    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required.",
        });
      }

      const { user, token } = await backofficeUserService.loginService(username, password);

      logger.info("Backoffice login successful.", { username });

      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
          id: user._id,
          username: user.username,
          accessLevel: user.accessLevel,
          token,
        },
      });
    } catch (err: any) {
      logger.error("Login Error", { error: err.message });
      res.status(401).json({
        success: false,
        message: "Invalid username or password.",
        error: err.message,
      });
    }
  }

  static async logoutController(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(400).json({
          success: false,
          message: "Authorization token missing.",
        });
      }

      const token = authHeader.split(" ")[1];
      await backofficeUserService.logoutService(token);

      logger.info("User logged out successfully.");
      res.status(200).json({
        success: true,
        message: "Logout successful. Token invalidated.",
      });
    } catch (err: any) {
      logger.error("Logout Error", { error: err.message });
      res.status(500).json({
        success: false,
        message: "Failed to logout user.",
        error: err.message,
      });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required.",
        });
      }

      const data = await backofficeUserService.sendPasswordResetToken(email);
      logger.info("Password reset token sent.", { email });
      res.status(200).json({
        success: true,
        message: "Password reset token sent.",
        data,
      });
    } catch (err: any) {
      logger.error("Forgot Password Error", { error: err.message });
      res.status(500).json({
        success: false,
        message: "Failed to send password reset token.",
        error: err.message,
      });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { userId, newPassword } = req.body;
      if (!userId || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "User ID and new password are required.",
        });
      }

      const data = await backofficeUserService.changePassword(userId, newPassword);
      logger.info("Password changed successfully.", { userId });
      res.status(200).json({
        success: true,
        message: "Password changed successfully.",
        data,
      });
    } catch (err: any) {
      logger.error("Change Password Error", { error: err.message });
      res.status(500).json({
        success: false,
        message: "Failed to change password.",
        error: err.message,
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Token and new password are required.",
        });
      }

      const data = await backofficeUserService.resetPassword(token, newPassword);
      logger.info("Password reset successful.", { token });
      res.status(200).json({
        success: true,
        message: "Password reset successful.",
        data,
      });
    } catch (err: any) {
      logger.error("Reset Password Error", { error: err.message });
      res.status(500).json({
        success: false,
        message: "Failed to reset password.",
        error: err.message,
      });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const limitVal = req.query.limit ?? req.params.limit;
      if (limitVal !== undefined) {
        const limitNum = Number(limitVal);
        if (isNaN(limitNum) || limitNum <= 0) {
          logger.warn("Requested number of users is zero or invalid.");
          return res.status(400).json({
            success: false,
            message: "Limit must be greater than zero.",
          });
        }
        const data = await backofficeUserService.getNumberOfBackOfficeUsers(limitNum);
        logger.info("Fetched number of backoffice users.", { count: limitNum });
        return res.status(200).json({
          success: true,
          message: `Retrieved ${limitNum} back office users successfully.`,
          data,
        });
      }

      const data = await backofficeUserService.getAll();
      logger.info("Fetched all backoffice users.");
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully.",
        data,
      });
    } catch (err: any) {
      logger.error("Get Users Error", { error: err.message });
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve users.",
        error: err.message,
      });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await backofficeUserService.deleteById(id);

      if (!data) {
        logger.warn("Attempted to delete non-existing user.", { id });
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      logger.info("User deleted successfully.", { id });
      res.status(200).json({
        success: true,
        message: "User deleted successfully.",
        data,
      });
    } catch (err: any) {
      logger.error("Delete User Error", { error: err.message });
      res.status(500).json({
        success: false,
        message: "Failed to delete user.",
        error: err.message,
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id || req.body.id;
      const updateData = req.params.id ? req.body : { ...req.body, id: undefined };

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "User ID is required for update.",
        });
      }

      const data = await backofficeUserService.update(id, updateData);
      if (!data) {
        logger.warn("Update attempted on non-existing user.", { id });
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      logger.info("User updated successfully.", { id });
      res.status(200).json({
        success: true,
        message: "User updated successfully.",
        data,
      });
    } catch (err: any) {
      logger.error("Update User Error", { error: err.message });
      res.status(500).json({
        success: false,
        message: "Failed to update user.",
        error: err.message,
      });
    }
  }

  static async testUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await backofficeUserService.getById(id);

      if (!user) {
        logger.warn("TestUserById: user not found.", { id });
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      logger.info("TestUserById: user retrieved successfully.", { id });
      res.status(200).json({
        success: true,
        message: "User retrieved successfully.",
        data: user,
      });
    } catch (err: any) {
      logger.error("Test User Error", { error: err.message });
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user.",
        error: err.message,
      });
    }
  }
}

export default BackOfficeUserController;
