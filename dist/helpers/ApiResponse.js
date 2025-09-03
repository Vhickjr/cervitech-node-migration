"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetApiResponseMessages = exports.ApiResponseStatus = void 0;
var ApiResponseStatus;
(function (ApiResponseStatus) {
    ApiResponseStatus["BadRequest"] = "BadRequest";
    ApiResponseStatus["Successful"] = "Successful";
    ApiResponseStatus["Failed"] = "Failed";
    ApiResponseStatus["UnknownError"] = "UnknownError";
})(ApiResponseStatus || (exports.ApiResponseStatus = ApiResponseStatus = {}));
const GetApiResponseMessages = () => ({
    [ApiResponseStatus.BadRequest]: 400,
    [ApiResponseStatus.Successful]: 200,
    [ApiResponseStatus.Failed]: 500,
    [ApiResponseStatus.UnknownError]: 520,
});
exports.GetApiResponseMessages = GetApiResponseMessages;
