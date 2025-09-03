"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
exports.logger = winston_1.default.createLogger({
    level: 'info',
    transports: [
        new winston_1.default.transports.Console({ format: winston_1.default.format.simple() }),
    ],
});
exports.loggerStream = {
    write: (message) => exports.logger.info(message.trim()),
};
