"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    return token;
};
exports.generateToken = generateToken;
