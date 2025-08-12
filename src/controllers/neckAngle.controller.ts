// user.controller.ts
import { Request, Response } from 'express';
import { AutomatePostNeckAngleRecordsViewModel } from '../viewmodels/AutomatePostNeckAngleRecords';
import { getApiResponseMessages, ApiResponseStatus } from '../utils/apiResponse';
import appUserService from '../services/neckAngle.service';
import { logger } from '../utils/logger';
import { NeckAngleModel } from '../models/neckAngle';

export const postBatchNeckAngleRecords = async (
  req: Request,
  res: Response
): Promise<void> => {
  const postNeckAngleRecordViewModel: NeckAngleModel = req.body;
  logger.info(`NeckAngleModel: ${JSON.stringify(postNeckAngleRecordViewModel)}`);

  const responses = getApiResponseMessages();

  try {
    console.log("I am here!")
    console.log('postNeckAngleRecordViewModel', postNeckAngleRecordViewModel)
    if (
      !postNeckAngleRecordViewModel ||
      typeof postNeckAngleRecordViewModel.appUserId !== 'number' ||
      !Array.isArray(postNeckAngleRecordViewModel.angles) ||
      postNeckAngleRecordViewModel.angles.length === 0
    ) {
      console.log("I am not here!")
      res.status(400).json({
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: ApiResponseStatus.BadRequest,
        data: null,
      });
      return;
    }

    try {
      const data = await appUserService.postBatchNeckAngleRecordAsync(postNeckAngleRecordViewModel);
      res.status(200).json({
        statusCode: responses[ApiResponseStatus.Successful],
        message: ApiResponseStatus.Successful,
        data,
      });
    } catch (ex: unknown) {
      const error = ex instanceof Error ? ex : new Error('Custom exception');
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

export const postRandomTestBatchNeckAngleRecords = async (
  req: Request,
  res: Response
): Promise<void> => {
  const model: AutomatePostNeckAngleRecordsViewModel = req.body;
  logger.info(`AutomatePostNeckAngleRecordsViewModel: ${JSON.stringify(model)}`);

  const responses = getApiResponseMessages();

  try {
    if (
      !model ||
      typeof model.appUserId !== 'number' ||
      !Array.isArray(model.testValues) ||
      model.testValues.length === 0
    ) {
      res.status(400).json({
        statusCode: responses[ApiResponseStatus.BadRequest],
        message: ApiResponseStatus.BadRequest,
        data: null,
      });
      return;
    }

    try {
      const data = await appUserService.postRandomBatchNeckAngleRecordForTestAsync(model);
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

