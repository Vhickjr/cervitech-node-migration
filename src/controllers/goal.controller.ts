import { Request, Response } from 'express';
import { GoalService } from '../services/goal.service';
import { SetGoalViewModel, TurnOnGoalViewModel } from '../viewmodels/goal.viewmodel';
import { getApiResponseMessages, ApiResponseStatus } from '../utils/apiResponse';
import { DataResult } from '../helpers/DataResult';
import { logger } from '../utils/logger';


export async function turnOnGoalByUserId(req: Request, res: Response): Promise<void> {
  const model: SetGoalViewModel = req.body;
  logger.info(JSON.stringify(model));

  const responses = getApiResponseMessages();
  let dataResult: DataResult;
  try {
    const data = await GoalService.turnOnGoalAsync(model);
    dataResult = {
      statusCode: responses[ApiResponseStatus.Successful],
      message: ApiResponseStatus.Successful,
      data,
    };
  } catch (error: any) {
    logger.error(error.message);
    dataResult = {
      statusCode: responses[ApiResponseStatus.Failed],
      message: error.message,
      data: null,
    };
  }

  res.status(dataResult.statusCode).json(dataResult);
}

export async function turnOffGoalByUserId(req: Request, res: Response): Promise<void> {
  const model: TurnOnGoalViewModel = req.body;
  logger.info(JSON.stringify(model));

  const responses = getApiResponseMessages();
  let dataResult: DataResult;

  try {
    const data = await GoalService.turnOffGoalAsync(model);
    dataResult = {
      statusCode: responses[ApiResponseStatus.Successful],
      message: ApiResponseStatus.Successful,
      data,
    };
  } catch (error: any) {
    logger.error(error.message);
    dataResult = {
      statusCode: responses[ApiResponseStatus.Failed],
      message: error.message,
      data: null,
    };
  }

  res.status(dataResult.statusCode).json(dataResult);
}

export async function getGoalsByUserId(req: Request, res: Response): Promise<void> {
  const model: TurnOnGoalViewModel = req.body;
  logger.info(model.appUserId);

  const responses = getApiResponseMessages();
  let dataResult: DataResult;

  try {
    const data = await GoalService.getAllGoalsByIdAsync(model);
    dataResult = {
      statusCode: responses[ApiResponseStatus.Successful],
      message: ApiResponseStatus.Successful,
      data,
    };
  } catch (error: any) {
    logger.error(error.message);
    dataResult = {
      statusCode: responses[ApiResponseStatus.Failed],
      message: error.message,
      data: null,
    };
  }

  res.status(dataResult.statusCode).json(dataResult);
}

export async function getCurrentTargetedAverageNeckAngle(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.query.userid as string);
  logger.info(userId.toString());

  const responses = getApiResponseMessages();
  let dataResult: DataResult;

  try {
    const data = await GoalService.getCurrentTargetedAverageNeckAngleAsync(userId);
    dataResult = {
      statusCode: responses[ApiResponseStatus.Successful],
      message: ApiResponseStatus.Successful,
      data,
    };
  } catch (error: any) {
    logger.error(error.message);
    dataResult = {
      statusCode: responses[ApiResponseStatus.Failed],
      message: error.message,
      data: null,
    };
  }

  res.status(dataResult.statusCode).json(dataResult);
}