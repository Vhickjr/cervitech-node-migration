import { Request, Response } from 'express';
import { AppUserService } from '../services/appuser.service';

class CustomException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomException';
  }
}

const ApiResponseStatus = {
  BadRequest: 400,
  Successful: 200,
  Failed: 500,
  UnknownError: 500
};

export const UserController = {
  async toggleAllowPushNotifications(req: Request, res: Response): Promise<void> {
    let data: any = null;
    let dataResult: any = null;
    
    try {
      const { userId } = req.params;
      
      console.log(`Toggling push notifications for user: ${userId}`);

      if (!userId || isNaN(Number(userId))) {
        dataResult = {
          statusCode: ApiResponseStatus.BadRequest,
          message: 'BadRequest',
          data: null
        };
        res.status(ApiResponseStatus.BadRequest).json(dataResult);
        return;
      }

      try {
        data = await AppUserService.toggleAllowPushNotifications(userId);
        dataResult = {
          statusCode: ApiResponseStatus.Successful,
          message: 'Successful',
          data: data
        };
        res.json(dataResult);
      } catch (ex: any) {
        if (ex instanceof CustomException) {
          console.error(ex.message);
          dataResult = {
            statusCode: ApiResponseStatus.Failed,
            message: ex.message,
            data: null
          };
          res.status(ApiResponseStatus.Failed).json(dataResult);
        } else {
          throw ex;
        }
      }
    } catch (ex: any) {
      console.error(ex.message);
      dataResult = {
        statusCode: ApiResponseStatus.UnknownError,
        message: 'UnknownError',
        exceptionErrorMessage: ex.message,
        data: null
      };
      res.status(ApiResponseStatus.UnknownError).json(dataResult);
    }
  }
};
