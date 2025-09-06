// fcm.controller.ts
import { Request, Response } from 'express';
import { FCMTokenUpdateViewModel } from '../dtos/fcmToken.DTO';
import { getApiResponseMessages, ApiResponseStatus } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { FCMTokenService } from '../services/fcmToken.service';
export class FCMController {
  static async updateFCMToken(req: Request, res: Response): Promise<void> {
    const updateViewModel: FCMTokenUpdateViewModel = req.body;
    logger.info(`FCMTokenUpdateViewModel: ${JSON.stringify(updateViewModel)}`);

    const responses = getApiResponseMessages();

    if (
      !updateViewModel ||
      typeof updateViewModel.fcmToken !== 'string' ||
      typeof updateViewModel.userId !== 'number' ||
      updateViewModel.userId < 1
    ) {
      res.status(400).json({
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: "Invalid or missing FCM token or user ID.",
        data: null,
      });
      return;
    }

    try {
      const data = await FCMTokenService.updateFCMTokenAsync(updateViewModel);

      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: ApiResponseStatus.Successful,
        data,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unexpected error');
      logger.error(`FCMController.updateFCMToken: ${err.message}`);

      res.status(500).json({
        statusCode: responses[ApiResponseStatus.Failed],
        message: err.message,
        data: null,
      });
    }
  }
};
