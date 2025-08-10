// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { postRandomTestBatchNeckAngleRecords } from '../controllers/neckAngle.controller';

const router = Router();
router.post('/signup', AuthController.signup);
router.post('/request-reset', AuthController.sendPasswordToken);
router.post('/reset-password', AuthController.resetPassword);
router.post('/login', AuthController.login);

export default router;
