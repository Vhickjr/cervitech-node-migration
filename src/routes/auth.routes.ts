// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/signup', AuthController.signup);
router.put('/change-password', authenticateJWT, AuthController.changePassword);
router.post("/request-reset", AuthController.sendPasswordToken);
router.post("/reset-password", AuthController.resetPassword);
router.post('/login', AuthController.authenticate);
router.post('/logout', authenticateJWT, AuthController.logout);
router.get("/usernames/exists", AuthController.usernameAlreadyExists);
router.get("/validate-email", AuthController.isValidEmail)

export default router;
