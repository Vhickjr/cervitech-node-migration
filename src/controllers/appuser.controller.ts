import { Request, Response } from 'express';
import { AppUserService } from '../services/appuser.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

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

export const AppUserController = {
  async signup(req: Request, res: Response): Promise<void> {
    let data: any = null;
    let dataResult: any = null;

    try {
      if (!req.body.username || !req.body.firstName || !req.body.lastName || 
          !req.body.email || !req.body.password || !req.body.confirmPassword || 
          !req.body.mobileChannel) {
        dataResult = {
          statusCode: ApiResponseStatus.BadRequest,
          message: 'BadRequest - Missing required fields',
          data: null
        };
        res.status(ApiResponseStatus.BadRequest).json(dataResult);
        return;
      }

      try {
        data = await AppUserService.createAppUser(req.body);
        dataResult = {
          statusCode: ApiResponseStatus.Successful,
          message: 'Successful',
          data: data
        };
        res.status(201).json(dataResult);
      } catch (ex: any) {
        if (ex instanceof CustomException) {
          console.error(ex.message);
          dataResult = {
            statusCode: ApiResponseStatus.Failed,
            message: ex.message,
            data: null
          };
          res.status(ApiResponseStatus.BadRequest).json(dataResult);
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
  },

  async login(req: Request, res: Response): Promise<void> {
    let data: any = null;
    let dataResult: any = null;

    try {
      if (!req.body.emailOrUsername || !req.body.password || !req.body.mobileChannel) {
        dataResult = {
          statusCode: ApiResponseStatus.BadRequest,
          message: 'BadRequest - Missing required fields',
          data: null
        };
        res.status(ApiResponseStatus.BadRequest).json(dataResult);
        return;
      }

      try {
        data = await AppUserService.authenticateAppUser(req.body);
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
          res.status(ApiResponseStatus.BadRequest).json(dataResult);
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
  },

  async toggleAllowPushNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    let data: any = null;
    let dataResult: any = null;

    try {
      const { userId } = req.params;

      if (!userId) {
        dataResult = {
          statusCode: ApiResponseStatus.BadRequest,
          message: 'User ID is required',
          data: null
        };
        res.status(ApiResponseStatus.BadRequest).json(dataResult);
        return;
      }

      // Verify the user can only toggle their own notifications
      if (req.user && req.user.userId !== userId) {
        dataResult = {
          statusCode: 403,
          message: 'Forbidden - You can only toggle your own notifications',
          data: null
        };
        res.status(403).json(dataResult);
        return;
      }

      try {
        const newStatus = await AppUserService.toggleAllowPushNotifications(userId);
        
        dataResult = {
          statusCode: ApiResponseStatus.Successful,
          message: 'Push notification setting updated successfully',
          data: { allowPushNotifications: newStatus }
        };
        res.status(ApiResponseStatus.Successful).json(dataResult);
      } catch (ex: any) {
        if (ex instanceof CustomException) {
          console.error(ex.message);
          dataResult = {
            statusCode: ApiResponseStatus.Failed,
            message: ex.message,
            data: null
          };
          res.status(ApiResponseStatus.BadRequest).json(dataResult);
        } else {
          throw ex;
        }
      }
    } catch (ex: any) {
      console.error('Error in toggleAllowPushNotifications:', ex.message);
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
