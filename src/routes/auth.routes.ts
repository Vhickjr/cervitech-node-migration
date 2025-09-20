// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();
router.post('/signup', AuthController.signup);
router.post('/request-reset', AuthController.sendPasswordToken);
router.post('/reset-password', AuthController.resetPassword);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get("/authenticate", AuthController.authenticate);
router.get("/usernameAlreadyExists", AuthController.usernameAlreadyExists);
router.get("/isValidEmail", AuthController.isValidEmail);

export default router;
