// user.controller.ts
import { Request, Response } from 'express';
import { AutomatePostNeckAngleRecordsViewModel } from '../viewmodels/AutomatePostNeckAngleRecords';
import { NeckAngleService } from '../services/appUserServices/neckAngle.service';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { NeckAngleModel } from '../models/NeckAngle';
import { JobScheduler } from '../services/JobScheduler';

export class NeckAngleController {
  static async postBatchNeckAngleRecords(req: Request, res: Response): Promise<void> {
    const model: NeckAngleModel = req.body;
    logger.info(`NeckAngleModel: ${JSON.stringify(model)}`);

    if (
      !model ||
      typeof model.appUserId !== 'string' ||
      !Array.isArray(model.neckAngleRecords) ||
      model.neckAngleRecords.length === 0
    ) {
      res.status(400).json({
        statusCode: 400,
        message: "BadRequest",
        data: null,
      });
      return;
    }

    try {
      const data = await NeckAngleService.postBatchNeckAngleRecordAsync(model);
      res.status(200).json({
        statusCode: 200,
        message: "Successful",
        data,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom exception');
      logger.error(err.message);

      res.status(500).json({
        statusCode: 500,
        message: err.message,
        data: null,
      });
    }
  }

  static async postRandomTestBatchNeckAngleRecords(req: Request, res: Response): Promise<void> {
    const model: AutomatePostNeckAngleRecordsViewModel = req.body;
    logger.info(`AutomatePostNeckAngleRecordsViewModel: ${JSON.stringify(model)}`);

    if (
      !model ||
      typeof model.appUserId !== 'string' ||
      !Array.isArray(model.testValues)
    ) {
      res.status(400).json({
        statusCode: 400,
        message: "BadRequest",
        data: null,
      });
      return;
    }

    try {
      const data = await NeckAngleService.postRandomBatchNeckAngleRecordForTestAsync(model);
      res.status(200).json({
        statusCode: 200,
        message: "Successful",
        data,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: 500,
        message: err.message,
        data: null,
      });
    }
  }

  
  static async sendPushNotificationMessageForAverageNeckAngle(req: Request, res: Response): Promise<void> {

    try {
      // Accept optional payload in body but the service recomputes per-user averages
      const payload = req.body || {};
      const summary = await NeckAngleService.sendPushNotificationMessageForAverageNeckAngle(payload as any);
      res.status(200).json({
        statusCode: 200,
        message: 'Notification sent successfully',
        data: summary,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode:500,
        message: err.message,
        data: null,
      });
    }
  }

  static async resetNotificationCount(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        statusCode: 400,
        message: 'User ID is required',
        data: null,
      });
      return;
    }

    try {
      await JobScheduler.resetNotificationCount(userId);
      res.status(200).json({
        statusCode: 200,
        message: 'Notification count reset successfully',
        data: true,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: 500,
        message: err.message,
        data: null,
      });
    }
  }

  static async getUsersForTesting(req: Request, res: Response): Promise<void> {

    try {
      const { default: AppUser } = await import('../models/AppUser');
      const users = await AppUser.find({}, { _id: 1, username: 1, email: 1, fcmToken: 1 }).limit(10);
      
      res.status(200).json({
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: 500,
        message: err.message,
        data: null,
      });
    }
  }

  static async getCurrentDayAverageNeckAngleTextReport(req: Request, res: Response): Promise<void> {
    const { neckAngle } = req.query;

    if (!neckAngle || isNaN(Number(neckAngle))) {
      res.status(400).json({
        statusCode: 400,
        message: 'Valid neck angle is required',
        data: null,
      });
      return;
    }

    try {
      const { Utils } = await import('../utils/utils');
      const report = Utils.currentDayAverageNeckAngleTextReport(Number(neckAngle));
      
      res.status(200).json({
        statusCode: 200,
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
        statusCode: 500,
        message: err.message,
        data: null,
      });
    }
  }


  static async getUserNeckAngleStatistics(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const data = await NeckAngleService.computeNeckAngleParameters(userId);
      return res.status(200).json({ message: 'Successful', data });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async getAppUserNeckAngleRecordsById(req: Request, res: Response): Promise<void> {
    
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        statusCode: 400,
        message: 'User ID is required',
        data: null,
      });
      return;
    }

    try {
      const data = await NeckAngleService.getAppUserNeckAngleRecordsByIdAsync(userId);
      res.status(200).json({
        statusCode: 200,
        message: 'Neck angle records retrieved successfully',
        data,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: 500,
        message: err.message,
        data: null,
      });
    }
  }

  static async getAppUserNeckAngleRecordsForaDateRangebyId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId) {
      res.status(400).json({
        statusCode: 400,
        message: 'User ID is required',
        data: null,
      });
      return;
    }

    if (!startDate || !endDate) {
      res.status(400).json({
        statusCode: 400,
        message: 'Start date and end date are required',
        data: null,
      });
      return;
    }

    try {
      const data = await NeckAngleService.getAppUserNeckAngleRecordsForaDateRangebyIdAsync(
        userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.status(200).json({
        statusCode: 200,
        message: 'Neck angle records retrieved successfully',
        data,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Custom error');
      logger.error(err.message);

      res.status(500).json({
        statusCode: 500,
        message: err.message,
        data: null,
      });
    }
  }
}



