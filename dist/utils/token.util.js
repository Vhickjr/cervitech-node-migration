"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'default';
exports.TokenUtil = {
    generateResetToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, SECRET, { expiresIn: '15m' });
    },
    verifyResetToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, SECRET);
        }
        catch {
            throw new Error('Invalid or expired token');
        }
    }
};
