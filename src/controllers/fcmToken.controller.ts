// fcm.controller.ts
import { Request, Response } from 'express';
const { getApiResponseMessages, ApiResponseStatus } = require('../utils/apiResponse');
const AppUserService = require('../services/appUserService');
const logger = require('../utils/logger');
import {FCMTokenUpdateViewModel} from "../viewmodels/FCMTokenUpdateViewModel";

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

export const updateFCMToken = async (req: Request, res: Response): Promise<void> => {
  const updateViewModel: FCMTokenUpdateViewModel = req.body;
  logger.info(`Received FCMTokenUpdate request: ${JSON.stringify(updateViewModel)}`);

  const responses = getApiResponseMessages();
  let dataResult;

  try {
    if (!updateViewModel || !updateViewModel.userId || !updateViewModel.fcmToken) {
      dataResult = {
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: ApiResponseStatus.BadRequest,
        data: null,
      };
      res.status(dataResult.statusCode).json(dataResult);
      return;
    }

    try {
      const data = await AppUserService.updateFCMToken(updateViewModel);

      dataResult = {
        statusCode: responses[ApiResponseStatus.Successful],
        message: ApiResponseStatus.Successful,
        data,
      };
      res.status(dataResult.statusCode).json(dataResult);
    } catch (ex: unknown) {
      const error = ex instanceof Error ? ex : new Error("Custom error occurred");
      logger.error(`FCMToken update failed: ${error.message}`);

      dataResult = {
        statusCode: responses[ApiResponseStatus.Failed],
        message: error.message,
        data: null,
      };
      res.status(dataResult.statusCode).json(dataResult);
    }
  } catch (ex: unknown) {
    const error = ex instanceof Error ? ex : new Error("Unexpected error occurred");
    logger.error(`Unexpected error in FCMToken update: ${error.message}`);

    dataResult = {
      statusCode: responses[ApiResponseStatus.UnknownError],
      message: ApiResponseStatus.UnknownError,
      exceptionErrorMessage: error.message,
      data: null,
    };
    res.status(500).json(dataResult);
  }
};