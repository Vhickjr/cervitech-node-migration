import { AuthService } from '../services/auth.service.js';
export const AuthController = {
    async signup(req, res) {
        try {
            const result = await AuthService.signup(req.body);
            res.status(201).json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async requestReset(req, res) {
        try {
            const result = await AuthService.requestPasswordReset(req.body);
            res.status(200).json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async resetPassword(req, res) {
        try {
            const result = await AuthService.resetPassword(req.body);
            res.status(200).json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async login(req, res) {
        try {
            const result = await AuthService.login(req.body);
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
