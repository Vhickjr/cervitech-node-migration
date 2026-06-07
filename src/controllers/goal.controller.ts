import { Request, Response } from 'express';
import { GoalService } from '../services/goal.service';
import { SetGoalViewModel, TurnOnGoalViewModel } from '../types/goal.types';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

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
      const result = await GoalService.turnOnGoalAsync(model);

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
      const result = await GoalService.turnOffGoalAsync(model);

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

    if (!model) {
      res.status(400).json({ error: 'User ID is required to fetch goals.' });
      return;
    }

    try {
      const result = await GoalService.getAllGoalsByIdAsync(model);

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
}
