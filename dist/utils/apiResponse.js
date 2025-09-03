"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseStatus = void 0;
exports.getApiResponseMessages = getApiResponseMessages;
const ApiResponseStatus = {
    BadRequest: 'BadRequest',
    Successful: 'Successful',
    Failed: 'Failed',
    UnknownError: 'UnknownError',
};
exports.ApiResponseStatus = ApiResponseStatus;
function getApiResponseMessages() {
    return {
        [ApiResponseStatus.BadRequest]: 400,
        [ApiResponseStatus.Successful]: 200,
        [ApiResponseStatus.Failed]: 500,
        [ApiResponseStatus.UnknownError]: 500,
    };
}
