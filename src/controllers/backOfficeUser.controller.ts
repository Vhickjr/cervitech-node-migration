import { Request, Response } from "express";
import "express-session";
import backofficeUserService from "../services/backofficeuser.service";
import { getApiResponseMessages, ApiResponseStatus, DataResult } from "../utils/apiResponse";


declare module "express-session" {
  interface SessionData {
    userName?: string;
  }
}

const responses = getApiResponseMessages();

class BackOfficeUserController {
  static async createUser(req: Request, res: Response) {
    try {
      const data = await backofficeUserService.create(req.body);
      const result: DataResult = {
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      };
      res.json(result);
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async loginController(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await backofficeUserService.loginService(username, password);

      req.session.userName = user.username;

      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: "Login successful",
        Data: { username: user.username },
      });
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async getBySessionUserName(req: Request, res: Response) {
    try {
      const username = req.session?.userName;
      if (!username) {
        return res.json({
          StatusCode: responses[ApiResponseStatus.Failed],
          Message: "Session username not found.",
          Data: "",
        });
      }
      const data = await backofficeUserService.getByUserName(username);
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      });
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const data = await backofficeUserService.sendPasswordResetToken(email);
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      });
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { userId, newPassword } = req.body;
      const data = await backofficeUserService.changePassword(userId, newPassword);
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      });
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const data = await backofficeUserService.resetPassword(token, newPassword);
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      });
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async getAllUsers(_req: Request, res: Response) {
    try {
      const data = await backofficeUserService.getAll();
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      });
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async getNumberOfBackOfficeUsers(req: Request, res: Response) {
    try {
      const { number } = req.params;
      const data = await backofficeUserService.getNumberOfBackOfficeUsers(Number(number));
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      });
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await backofficeUserService.deleteById(id);
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      });
    } catch (err: any) {
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: "",
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id || req.body.id;
      const updateData = req.params.id ? req.body : { ...req.body, id: undefined };
      
      console.log('Update User Request:', { id, updateData });
      console.log('Request body:', req.body);
      console.log('Request params:', req.params);
      
      if (!id) {
        return res.json({
          StatusCode: responses[ApiResponseStatus.BadRequest],
          Message: "User ID is required",
          Data: null,
        });
      }

      const data = await backofficeUserService.update(id, updateData);
      console.log('Update User Result:', data);
      
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: data,
      });
    } catch (err: any) {
      console.error('Update User Error:', err);
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: null,
      });
    }
  }

  static async testUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('Testing user with ID:', id);
      
      const user = await backofficeUserService.getById(id);
      console.log('Found user:', user);
      
      res.json({
        StatusCode: responses[ApiResponseStatus.Successful],
        Message: ApiResponseStatus.Successful,
        Data: user,
      });
    } catch (err: any) {
      console.error('Test User Error:', err);
      res.json({
        StatusCode: responses[ApiResponseStatus.Failed],
        Message: err.message,
        Data: null,
      });
    }
  }
}

export default BackOfficeUserController;
