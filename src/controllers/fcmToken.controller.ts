// fcm.controller.ts
import { Request, Response } from 'express';
// import {FCMTokenUpdateViewModel} from "../viewmodels/FCMTokenUpdateViewModel";
import { AppUserService } from '../services/appUserServices/appUserService.service';
import { getApiResponseMessages, ApiResponseStatus } from '../utils/apiResponse';
import {logger} from '../utils/logger';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
/* // Update FCMToken
interface FCMTokenUpdateViewModel {
  userId: number;
  fcmToken: string;
  // Add other properties here as needed
}

export const updateFCMToken = async (req: Request, res: Response): Promise<void> => {
  const updateViewModel: FCMTokenUpdateViewModel = req.body;
  logger.info(`FCMTokenUpdateViewModel: ${JSON.stringify(updateViewModel)}`);

  const responses = getApiResponseMessages();

  try {
    if (
      !updateViewModel ||
      typeof updateViewModel.fcmToken !== 'string' ||
      typeof updateViewModel.userId !== 'number'
    ) {
      res.status(400).json({
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: ApiResponseStatus.BadRequest,
        data: null,
      });
      return;
    }

    try {
      const data = await appUserService.updateFCMTokenAsync(updateViewModel);
      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: ApiResponseStatus.Successful,
        data,
      });
    } catch (ex: unknown) {
      const error = ex instanceof Error ? ex : new Error('Custom error');
      logger.error(error.message);

      res.status(500).json({
        statusCode: responses[ApiResponseStatus.Failed],
        message: error.message,
        data: null,
      });
    }
  } catch (ex: unknown) {
    const error = ex instanceof Error ? ex : new Error('Unexpected error');
    logger.error(error.message);

    res.status(500).json({
      statusCode: responses[ApiResponseStatus.UnknownError],
      message: ApiResponseStatus.UnknownError,
      exceptionErrorMessage: error.message,
      data: null,
    });
  }
};
 */

export class FCMController{
  static async updateFCMToken(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;
      const { fcmToken } = req.body;

      if (!fcmToken) {
        return res.status(400).json({ error: 'fcmToken is required' });
      }

      const updatedUser = await AppUserService.updateFCMToken(userId!, fcmToken);

      res.status(200).json({
        message: 'FCM token updated successfully',
        data: updatedUser,
      });
    } catch (err: any) {
      logger.error(`FCMToken update failed: ${err.message}`);
      res.status(500).json({ error: err.message || 'FCMToken update failed' });
    }
  }
}
