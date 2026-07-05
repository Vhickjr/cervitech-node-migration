import { Request, Response } from 'express';
import { GoalService } from '../services/goal.service';
import { SetGoalViewModel, TurnOnGoalViewModel } from '../types/goal.types';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { PushNotificationDriver } from '../services/pushNotificationDriver';
import { PushNotificationModelDTO } from '../types/pushNotificationModel.types';
import { JobScheduler } from '../services/JobScheduler';

export class GoalController {
  static async turnOnGoalByUserId(req: AuthenticatedRequest, res: Response): Promise<void> {
    const model: SetGoalViewModel = req.body;
    const appUserId = req.user?.userId;

    if (!appUserId) {
      res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
      return;
    }

    if (!model) {
      res.status(400).json({ error: 'Goal data with valid user ID is required.' });
      return;
    }

    try {
      const result = await GoalService.turnOnGoalAsync(appUserId, model);

      if (!result) {
        res.status(400).json({ error: 'Failed to turn on goal.' });
        return;
      }

      res.status(201).json(result);
    } catch (error) {
      logger.error('Error turning on goal:', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async turnOffGoalByUserId(req: AuthenticatedRequest, res: Response): Promise<void> {
    const model: TurnOnGoalViewModel = req.body;
    const appUserId = req.user?.userId;

    if (!appUserId) {
      res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
      return;
    }

    if (!model) {
      res.status(400).json({ error: 'Goal data with valid user ID is required.' });
      return;
    }

    try {
      const result = await GoalService.turnOffGoalAsync(appUserId, model);

      if (!result) {
        res.status(400).json({ error: 'Failed to turn off goal.' });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('Error turning off goal:');
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getGoalsByUserId(req: AuthenticatedRequest, res: Response): Promise<void> {
    const model: TurnOnGoalViewModel = req.body;
    const appUserId = req.user?.userId;

    if (!appUserId) {
      res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
      return;
    }

    if (!model) {
      res.status(400).json({ error: 'User ID is required to fetch goals.' });
      return;
    }

    try {
      const result = await GoalService.getAllGoalsByIdAsync(appUserId, model);

      if (!result || result.length === 0) {
        res.status(404).json({ error: 'No goals found for this user.' });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('Error fetching goals by user ID:');
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getCurrentTargetedAverageNeckAngle(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user?.userId;

    if (!userId || userId.trim() === '') {
      res.status(400).json({ error: 'Valid user ID is required.' });
      return;
    }

    try {
      const result = await GoalService.getCurrentTargetedAverageNeckAngleAsync(userId);

      if (result === null || result === undefined) {
        res.status(404).json({ error: 'No neck angle data found for this user.' });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('Error fetching neck angle data:');
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async testPush(req: Request, res: Response): Promise<void> {
    const token = req.query.token as string | undefined;

    if (!token) {
      res.status(400).json({ error: 'FCM token is required (query param: token).' });
      return;
    }

    try {
      const model: PushNotificationModelDTO = {
        to: token,
        title: 'Test Push',
        body: 'Test push notification',
      };
      await PushNotificationDriver.sendPushNotification(model);
      res.status(200).json({ message: 'Push notification sent' });
    } catch (error) {
      logger.error(
        'Error sending test push:',
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({ error: 'Failed to send push notification' });
    }
  }

  static async testScheduler(req: Request, res: Response): Promise<void> {
    const token = req.query.token as string | undefined;
    const cron = (req.query.cron as string) || '* * * * *';

    if (!token) {
      res.status(400).json({ error: 'FCM token is required (query param: token).' });
      return;
    }

    try {
      const jobId = `test-push-${token}`;
      const title = 'Test Scheduler';
      const body = 'Scheduled test push notification';
      JobScheduler.addJob(jobId, cron, async () => {
        await PushNotificationDriver.sendPushNotification({ to: token, title, body });
      });
      res.status(200).json({ message: 'Scheduler started', cron, jobId });
    } catch (error) {
      logger.error(
        'Error starting scheduler:',
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({ error: 'Failed to start scheduler' });
    }
  }

  static async stopScheduler(_req: Request, res: Response): Promise<void> {
    try {
      JobScheduler.removeAllJobs();
      res.status(200).json({ message: 'All test schedulers stopped' });
    } catch (error) {
      logger.error(
        'Error stopping scheduler:',
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({ error: 'Failed to stop scheduler' });
    }
  }
}
