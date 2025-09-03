"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const appUserService_service_1 = require("../services/appUserService.service");
const ApiResponse_1 = require("../helpers/ApiResponse");
class UserController {
    static async updatePictureUrl(req, res) {
        const responses = (0, ApiResponse_1.GetApiResponseMessages)();
        const updateViewModel = req.body;
        console.log("UpdatePictureUrl input:", updateViewModel);
        let dataResult;
        try {
            if (!updateViewModel.userId || !updateViewModel.pictureUrl) {
                dataResult = {
                    statusCode: responses[ApiResponse_1.ApiResponseStatus.BadRequest],
                    message: ApiResponse_1.ApiResponseStatus.BadRequest,
                    data: null
                };
                res.status(dataResult.statusCode).json(dataResult);
                return;
            }
            try {
                const result = await appUserService_service_1.AppUserService.updatePictureUrlAsync(updateViewModel);
                dataResult = {
                    statusCode: responses[ApiResponse_1.ApiResponseStatus.Successful],
                    message: ApiResponse_1.ApiResponseStatus.Successful,
                    data: result
                };
            }
            catch (customError) {
                console.error("CustomException:", customError.message);
                dataResult = {
                    statusCode: responses[ApiResponse_1.ApiResponseStatus.Failed],
                    message: customError.message,
                    data: null
                };
            }
        }
        catch (error) {
            console.error("Exception:", error.message);
            dataResult = {
                statusCode: responses[ApiResponse_1.ApiResponseStatus.UnknownError],
                message: ApiResponse_1.ApiResponseStatus.UnknownError,
                exceptionErrorMessage: error.message,
                data: null
            };
        }
        res.status(dataResult.statusCode).json(dataResult);
        return;
    }
    static async updateSubscription(req, res) {
        const responses = (0, ApiResponse_1.GetApiResponseMessages)();
        // const id = parseInt(req.params.id);
        const id = req.params.id;
        console.log("UpdateSubscription input ID:", id);
        let dataResult;
        try {
            try {
                const result = await appUserService_service_1.AppUserService.updateSubscriptionAsync(id);
                dataResult = {
                    statusCode: responses[ApiResponse_1.ApiResponseStatus.Successful],
                    message: ApiResponse_1.ApiResponseStatus.Successful,
                    data: result
                };
            }
            catch (customError) {
                console.error("CustomException:", customError.message);
                dataResult = {
                    statusCode: responses[ApiResponse_1.ApiResponseStatus.Failed],
                    message: customError.message,
                    data: null
                };
            }
        }
        catch (error) {
            console.error("Unhandled Exception:", error.message);
            dataResult = {
                statusCode: responses[ApiResponse_1.ApiResponseStatus.UnknownError],
                message: ApiResponse_1.ApiResponseStatus.UnknownError,
                exceptionErrorMessage: error.message,
                data: null
            };
        }
        res.status(dataResult.statusCode).json(dataResult);
        return;
    }
    static async getResponseRate(req, res) {
        const responses = (0, ApiResponse_1.GetApiResponseMessages)();
        const id = req.query.id;
        const dateStr = req.query.date;
        let dataResult;
        try {
            // Validate input
            if (!id || !dateStr || isNaN(Date.parse(dateStr))) {
                dataResult = {
                    statusCode: responses[ApiResponse_1.ApiResponseStatus.BadRequest],
                    message: ApiResponse_1.ApiResponseStatus.BadRequest,
                    data: null
                };
                return res.status(dataResult.statusCode).json(dataResult);
            }
            try {
                const date = new Date(dateStr);
                const result = await appUserService_service_1.AppUserService.getResponseRateAsync(id, date);
                dataResult = {
                    statusCode: responses[ApiResponse_1.ApiResponseStatus.Successful],
                    message: ApiResponse_1.ApiResponseStatus.Successful,
                    data: result
                };
            }
            catch (customError) {
                console.error("CustomException:", customError.message);
                dataResult = {
                    statusCode: responses[ApiResponse_1.ApiResponseStatus.Failed],
                    message: customError.message,
                    data: null
                };
            }
        }
        catch (error) {
            console.error("Unhandled Exception:", error.message);
            dataResult = {
                statusCode: responses[ApiResponse_1.ApiResponseStatus.UnknownError],
                message: ApiResponse_1.ApiResponseStatus.UnknownError,
                exceptionErrorMessage: error.message,
                data: null
            };
        }
        return res.status(dataResult.statusCode).json(dataResult);
    }
    ;
}
exports.UserController = UserController;
