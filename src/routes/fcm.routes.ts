// src/routes/fcm.routes.ts
import { Router } from 'express';
import { FCMController } from '../controllers/fcmToken.controller';
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();
router.put('/update-fcm-token', authenticateJWT,FCMController.updateFCMToken);

export default router;