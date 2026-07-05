// src/routes/fcm.routes.ts
import { Router } from 'express';
import { FCMController } from '../controllers/fcmToken.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.put('/token', authenticateJWT, FCMController.updateFCMToken);

// Test/dev endpoints (no auth)
router.get('/test-push', FCMController.testPush);
router.post('/test-scheduler', FCMController.testScheduler);
router.post('/stop-scheduler', FCMController.stopScheduler);

export default router;
