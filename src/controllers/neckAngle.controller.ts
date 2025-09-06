// user.controller.ts
import { Request, Response } from 'express';
import { AutomatePostNeckAngleRecordsViewModel } from '../viewmodels/AutomatePostNeckAngleRecords';
import { getApiResponseMessages, ApiResponseStatus } from '../utils/apiResponse';
import { NeckAngleService } from '../services/appUserServices/neckAngle.service';
import { logger } from '../utils/logger';
import { NeckAngleModel } from '../models/neckAngle';

export class NeckAngleController {
  static async postBatchNeckAngleRecords(req: Request, res: Response): Promise<void> {
    const model: NeckAngleModel = req.body;
    logger.info(`NeckAngleModel: ${JSON.stringify(model)}`);

    const responses = getApiResponseMessages();

    if (
      !model ||
      typeof model.appUserId !== 'number' ||
      !Array.isArray(model.neckAngleRecords) ||
      model.neckAngleRecords.length === 0
    ) {
      res.status(400).json({
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: ApiResponseStatus.BadRequest,
        data: null,
      });
      return;
    }

    try {
      const data = await NeckAngleService.postBatchNeckAngleRecordAsync(model);
      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: ApiResponseStatus.Successful,
        data,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom exception');
      logger.error(err.message);

      res.status(500).json({
        statusCode: responses[ApiResponseStatus.Failed],
        message: err.message,
        data: null,
      });
    }
  }

  static async postRandomTestBatchNeckAngleRecords(req: Request, res: Response): Promise<void> {
    const model: AutomatePostNeckAngleRecordsViewModel = req.body;
    logger.info(`AutomatePostNeckAngleRecordsViewModel: ${JSON.stringify(model)}`);

    const responses = getApiResponseMessages();

    if (
      !model ||
      typeof model.appUserId !== 'string' ||
      !Array.isArray(model.testValues)
    ) {
      res.status(400).json({
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: ApiResponseStatus.BadRequest,
        data: null,
      });
      return;
    }

    try {
      const data = await NeckAngleService.postRandomBatchNeckAngleRecordForTestAsync(model);
      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: ApiResponseStatus.Successful,
        data,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: responses[ApiResponseStatus.Failed],
        message: err.message,
        data: null,
      });
    }
  }

  static async sendPushNotificationMessageForAverageNeckAngle(req: Request, res: Response): Promise<void> {
    const responses = getApiResponseMessages();

    try {
      const data = await NeckAngleService.sendPushNotificationMessageForAverageNeckAngle();
      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: ApiResponseStatus.Successful,
        data,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: responses[ApiResponseStatus.Failed],
        message: err.message,
        data: null,
      });
    }
  }

  static async resetNotificationCount(req: Request, res: Response): Promise<void> {
    const responses = getApiResponseMessages();
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: 'User ID is required',
        data: null,
      });
      return;
    }

    try {
      const { JobScheduler } = await import('../services/JobScheduler');
      await JobScheduler.resetNotificationCount(userId);
      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: 'Notification count reset successfully',
        data: true,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: responses[ApiResponseStatus.Failed],
        message: err.message,
        data: null,
      });
    }
  }

  static async getUsersForTesting(req: Request, res: Response): Promise<void> {
    const responses = getApiResponseMessages();

    try {
      const { default: AppUser } = await import('../models/AppUser');
      const users = await AppUser.find({}, { _id: 1, username: 1, email: 1, fcmToken: 1 }).limit(10);
      
      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: responses[ApiResponseStatus.Failed],
        message: err.message,
        data: null,
      });
    }
  }

  static async getCurrentDayAverageNeckAngleTextReport(req: Request, res: Response): Promise<void> {
    const responses = getApiResponseMessages();
    const { neckAngle } = req.query;

    if (!neckAngle || isNaN(Number(neckAngle))) {
      res.status(400).json({
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: 'Valid neck angle is required',
        data: null,
      });
      return;
    }

    try {
      const { Utils } = await import('../helpers/utils');
      const report = Utils.currentDayAverageNeckAngleTextReport(Number(neckAngle));
      
      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: 'Text report generated successfully',
        data: {
          neckAngle: Number(neckAngle),
          report: report
        },
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: responses[ApiResponseStatus.Failed],
        message: err.message,
        data: null,
      });
    }
  }
}


