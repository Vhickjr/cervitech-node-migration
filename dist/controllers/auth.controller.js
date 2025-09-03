"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
exports.AuthController = {
    async signup(req, res) {
        try {
            const result = await auth_service_js_1.AuthService.signup(req.body);
            res.status(201).json(result);
        }
        catch (err) {
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
            res.status(200).json(result);
        }
        catch (err) {
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
