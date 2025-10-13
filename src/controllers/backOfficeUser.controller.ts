import { Request, Response } from "express";
import "express-session";
import backofficeUserService from "../services/backofficeuser.service";

declare module "express-session" {
  interface SessionData {
    userName?: string;
  }
}

class BackOfficeUserController {
  static async createUser(req: Request, res: Response) {
    try {
      const data = await backofficeUserService.create(req.body);
      res.status(201).json({
        success: true,
        message: "User created successfully.",
        data,
      });
    } catch (err: any) {
      console.error("Create User Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Failed to create user.",
        error: err.message,
      });
    }
  }

  static async loginController(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required.",
        });
      }

      const user = await backofficeUserService.loginService(username, password);
      req.session.userName = user.username;

      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: user,
      });
    } catch (err: any) {
      console.error("Login Error:", err.message);
      res.status(401).json({
        success: false,
        message: "Invalid username or password.",
        error: err.message,
      });
    }
  }

  static async getBySessionUserName(req: Request, res: Response) {
    try {
      const username = req.session?.userName;
      if (!username) {
        return res.status(401).json({
          success: false,
          message: "User not logged in or session expired.",
        });
      }

      const data = await backofficeUserService.getByUserName(username);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "User retrieved successfully.",
        data,
      });
    } catch (err: any) {
      console.error("Get By Session Username Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user.",
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
      res.status(200).json({
        success: true,
        message: "Password reset token sent.",
        data,
      });
    } catch (err: any) {
      console.error("Forgot Password Error:", err.message);
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
      res.status(200).json({
        success: true,
        message: "Password changed successfully.",
        data,
      });
    } catch (err: any) {
      console.error("Change Password Error:", err.message);
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
      res.status(200).json({
        success: true,
        message: "Password reset successful.",
        data,
      });
    } catch (err: any) {
      console.error("Reset Password Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Failed to reset password.",
        error: err.message,
      });
    }
  }

  static async getAllUsers(_req: Request, res: Response) {
    try {
      const data = await backofficeUserService.getAll();
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully.",
        data,
      });
    } catch (err: any) {
      console.error("Get All Users Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve users.",
        error: err.message,
      });
    }
  }

  static async getNumberOfBackOfficeUsers(req: Request, res: Response) {
    try {
      const { number } = req.params;
      const data = await backofficeUserService.getNumberOfBackOfficeUsers(Number(number));

      res.status(200).json({
        success: true,
        message: `Retrieved ${number} back office users successfully.`,
        data,
      });
    } catch (err: any) {
      console.error("Get Number of BackOffice Users Error:", err.message);
      res.status(500).json({
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
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully.",
        data,
      });
    } catch (err: any) {
      console.error("Delete User Error:", err.message);
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
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully.",
        data,
      });
    } catch (err: any) {
      console.error("Update User Error:", err.message);
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
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "User retrieved successfully.",
        data: user,
      });
    } catch (err: any) {
      console.error("Test User Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user.",
        error: err.message,
      });
    }
  }
}

export default BackOfficeUserController;
