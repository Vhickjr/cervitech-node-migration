"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// MAIN BUSINESS LOGIC
// src/services/auth.service.ts
// import { UserRepository } from '../infrastructure/repositories/user.repository';
const hash_1 = require("../utils/hash");
const token_util_1 = require("../utils/token.util");
// import jwt from 'jsonwebtoken';
const generateToken_1 = require("../utils/generateToken");
const User_1 = __importDefault(require("../models/User"));
class AuthService {
    static async signup(data) {
        console.log("Data", data);
        const existing = await User_1.default.findOne({ email: data.email });
        if (existing)
            throw new Error('Email already in use');
        const hashedPassword = await hash_1.HashUtil.hash(data.password);
        const newUser = await User_1.default.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
        });
        return {
            message: 'Signup successful',
            data: newUser,
        };
    }
    static async sendPasswordResetToken({ email }) {
        const user = await User_1.default.findOne({ email });
        if (!user)
            throw new Error('User not found');
        const token = token_util_1.TokenUtil.generateResetToken(user._id.toString());
        return {
            message: 'Password link generated',
            resetLink: `http://localhost:4000/api/auth/reset-password?token=${token}`
        };
    }
    static async resetPassword({ token, newPassword }) {
        const { userId } = token_util_1.TokenUtil.verifyResetToken(token);
        const hashed = await hash_1.HashUtil.hash(newPassword);
        await User_1.default.findByIdAndUpdate(userId, { password: hashed });
        return { message: 'Password reset successfully' };
    }
    static async login(email, password) {
        const user = await User_1.default.findOne({ email: email });
        if (!user)
            throw new Error('User not found');
        const isValidPassword = await hash_1.HashUtil.compare(password, user.password);
        if (!isValidPassword)
            throw new Error('Invalid password');
        const token = (0, generateToken_1.generateToken)(user);
        return {
            id: user._id.toString(),
            username: user.name,
            email: user.email,
            token
        };
    }
}
exports.AuthService = AuthService;
