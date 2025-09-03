"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeckAngleController = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const neckAngle_service_1 = require("../services/neckAngle.service");
const logger_1 = require("../utils/logger");
class NeckAngleController {
    static async postBatchNeckAngleRecords(req, res) {
        const model = req.body;
        logger_1.logger.info(`NeckAngleModel: ${JSON.stringify(model)}`);
        const responses = (0, apiResponse_1.getApiResponseMessages)();
        if (!model ||
            typeof model.appUserId !== 'number' ||
            !Array.isArray(model.neckAngleRecords) ||
            model.neckAngleRecords.length === 0) {
            res.status(400).json({
                statusCode: responses[apiResponse_1.ApiResponseStatus.BadRequest],
                message: apiResponse_1.ApiResponseStatus.BadRequest,
                data: null,
            });
            return;
        }
        try {
            const data = await neckAngle_service_1.NeckAngleService.postBatchNeckAngleRecordAsync(model);
            res.status(200).json({
                statusCode: responses[apiResponse_1.ApiResponseStatus.Successful],
                message: apiResponse_1.ApiResponseStatus.Successful,
                data,
            });
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error('Custom exception');
            logger_1.logger.error(err.message);
            res.status(500).json({
                statusCode: responses[apiResponse_1.ApiResponseStatus.Failed],
                message: err.message,
                data: null,
            });
        }
    }
    static async postRandomTestBatchNeckAngleRecords(req, res) {
        const model = req.body;
        logger_1.logger.info(`AutomatePostNeckAngleRecordsViewModel: ${JSON.stringify(model)}`);
        const responses = (0, apiResponse_1.getApiResponseMessages)();
        if (!model ||
            typeof model.appUserId !== 'string' ||
            !Array.isArray(model.testValues)) {
            res.status(400).json({
                statusCode: responses[apiResponse_1.ApiResponseStatus.BadRequest],
                message: apiResponse_1.ApiResponseStatus.BadRequest,
                data: null,
            });
            return;
        }
        try {
            const data = await neckAngle_service_1.NeckAngleService.postRandomBatchNeckAngleRecordForTestAsync(model);
            res.status(200).json({
                statusCode: responses[apiResponse_1.ApiResponseStatus.Successful],
                message: apiResponse_1.ApiResponseStatus.Successful,
                data,
            });
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error('Custom error');
            logger_1.logger.error(err.message);
            res.status(500).json({
                statusCode: responses[apiResponse_1.ApiResponseStatus.Failed],
                message: err.message,
                data: null,
            });
        }
    }
}
exports.NeckAngleController = NeckAngleController;
