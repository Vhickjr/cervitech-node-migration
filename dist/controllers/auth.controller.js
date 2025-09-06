"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const newLogger_js_1 = require("../utils/newLogger.js");
exports.AuthController = {
    async signup(req, res) {
        try {
            const result = await auth_service_js_1.AuthService.signup(req.body);
            newLogger_js_1.Logger.info('User signed up successfully', { email: req.body.email });
            res.status(201).json(result);
        }
        catch (err) {
            newLogger_js_1.Logger.error('User signup failed', { email: req.body.email, error: err.message });
            res.status(400).json({ error: err.message });
        }
    },
    async sendPasswordToken(req, res) {
        try {
            const result = await auth_service_js_1.AuthService.sendPasswordResetToken(req.body);
            res.status(200).json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async resetPassword(req, res) {
        try {
            const result = await auth_service_js_1.AuthService.resetPassword(req.body);
            newLogger_js_1.Logger.info('Password reset successfully', { email: req.body.email });
            res.status(200).json(result);
        }
        catch (err) {
            newLogger_js_1.Logger.error('Password reset failed', { email: req.body.email, error: err.message });
            res.status(400).json({ error: err.message });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_js_1.AuthService.login(email, password);
            res.status(200).json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async logout(req, res) {
        try {
            // Send back logout confirmation
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (err) {
            res.status(500).json({ error: 'Logout failed' });
        }
    },
};
