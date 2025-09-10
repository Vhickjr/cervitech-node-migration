import { Request, Response } from "express";
import { PictureUrlUpdateViewModel } from "../viewmodels/PictureUrlUpdateViewModel";
import { AppUserService } from "../services/appUserServices/appUserService.service";
import { GetApiResponseMessages, ApiResponseStatus } from "../helpers/ApiResponse";
import { DataResult } from "../helpers/DataResult";
import { CustomException } from "../helpers/CustomException";
import { GetByEmailService } from "../services/appUserServices/getByEmail.service";
import { GetAllowPushNotificationService } from "../services/appUserServices/getAllowPushNotification.service";
import { getFCMTokenByUsernameService } from "../services/appUserServices/getFCMTokenByUsername.service";
import { AuthService } from "../services/appUserServices/authenticate.service";

export class UserController {
  static async updatePictureUrl(req: Request, res: Response): Promise<void> {
    const responses = GetApiResponseMessages();
    const updateViewModel: PictureUrlUpdateViewModel = req.body;

    console.log("UpdatePictureUrl input:", updateViewModel);

    let dataResult: DataResult;

    try {
      if (!updateViewModel.userId || !updateViewModel.pictureUrl) {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: ApiResponseStatus.BadRequest,
          data: null
        };
        res.status(dataResult.statusCode).json(dataResult);
        return
      }

      try {
        const result = await AppUserService.updatePictureUrlAsync(updateViewModel);
        dataResult = {
          statusCode: responses[ApiResponseStatus.Successful],
          message: ApiResponseStatus.Successful,
          data: result
        };
      } catch (customError: any) {
        console.error("CustomException:", customError.message);
        dataResult = {
          statusCode: responses[ApiResponseStatus.Failed],
          message: customError.message,
          data: null
        };
      }
    } catch (error: any) {
      console.error("Exception:", error.message);
      dataResult = {
        statusCode: responses[ApiResponseStatus.UnknownError],
        message: ApiResponseStatus.UnknownError,
        exceptionErrorMessage: error.message,
        data: null
      };
    }

    res.status(dataResult.statusCode).json(dataResult);
    return;
  }

  static async updateSubscription(req: Request, res: Response): Promise<void> {
    const responses = GetApiResponseMessages();
    // const id = parseInt(req.params.id);
    const id = req.params.id;

    console.log("UpdateSubscription input ID:", id);

    let dataResult: DataResult;

    try {
      try {
        const result = await AppUserService.updateSubscriptionAsync(id);

        dataResult = {
          statusCode: responses[ApiResponseStatus.Successful],
          message: ApiResponseStatus.Successful,
          data: result
        };
      } catch (customError: any) {
        console.error("CustomException:", customError.message);

        dataResult = {
          statusCode: responses[ApiResponseStatus.Failed],
          message: customError.message,
          data: null
        };
      }
    } catch (error: any) {
      console.error("Unhandled Exception:", error.message);

      dataResult = {
        statusCode: responses[ApiResponseStatus.UnknownError],
        message: ApiResponseStatus.UnknownError,
        exceptionErrorMessage: error.message,
        data: null
      };
    }

    res.status(dataResult.statusCode).json(dataResult);
    return
  }

  static async getResponseRate(req: Request, res: Response) {
    const responses = GetApiResponseMessages();

    const id = req.query.id as string;
    const dateStr = req.query.date as string;

    let dataResult: DataResult;

    try {
      // Validate input
      if (!id || !dateStr || isNaN(Date.parse(dateStr))) {
        dataResult = {
          statusCode: responses[ApiResponseStatus.BadRequest],
          message: ApiResponseStatus.BadRequest,
          data: null
        };
        return res.status(dataResult.statusCode).json(dataResult);
      }

      try {
        const date = new Date(dateStr);
        const result = await AppUserService.getResponseRateAsync(id, date);

        dataResult = {
          statusCode: responses[ApiResponseStatus.Successful],
          message: ApiResponseStatus.Successful,
          data: result
        };
      } catch (customError: any) {
        console.error("CustomException:", customError.message);
        dataResult = {
          statusCode: responses[ApiResponseStatus.Failed],
          message: customError.message,
          data: null
        };
      }
    } catch (error: any) {
      console.error("Unhandled Exception:", error.message);
      dataResult = {
        statusCode: responses[ApiResponseStatus.UnknownError],
        message: ApiResponseStatus.UnknownError,
        exceptionErrorMessage: error.message,
        data: null
      };
    } 

    return res.status(dataResult.statusCode).json(dataResult);
  };

  static async getByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email || typeof email !== 'string') {
        res.status(400).json({ message: 'Email is required and must be a string.' });
        return;
      }

      const user = await GetByEmailService.getByEmail(email);
      res.status(200).json(user);
    } 
    catch (error: any) {
      if (error instanceof CustomException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async getAllowPushNotificationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;

      if (typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({ message: 'A valid user ID is required.' });
        return;
      }

      const allowPush = await GetAllowPushNotificationService.getAllowPushNotificationStatus(id);
      res.status(200).json({ allowPushNotifications: allowPush });
    } catch (error: any) {
      if (error instanceof CustomException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async getFCMTokenByUsername(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;

      if (!username || typeof username !== 'string') {
        res.status(400).json({ message: 'Username is required and must be a string.' });
        return;
      }

      const service = new getFCMTokenByUsernameService();
      const token = await service.getFCMTokenByUsername(username);

      res.status(200).json({ fcmToken: token });
    } catch (error: any) {
      if (error instanceof CustomException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { emailOrUsername, password, mobileChannel } = req.body;

      if (
        !emailOrUsername ||
        typeof emailOrUsername !== 'string' ||
        !password ||
        typeof password !== 'string' ||
        !['ANDROID', 'IOS', 'OTHER'].includes(mobileChannel)
      ) {
        res.status(400).json({
          message:
            'Invalid login request. Please provide emailOrUsername, password, and a valid mobileChannel (1 or 2).'
        });
        return;
      }

      const user = await AuthService.authenticate({ emailOrUsername, password, mobileChannel });
      res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof CustomException) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

}