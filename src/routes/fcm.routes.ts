// src/routes/fcm.routes.ts
import { Router } from 'express';
import { updateFCMToken } from '../controllers/fcmToken.controller';

const router = Router();
router.post('/update-fcm-token', updateFCMToken);

export default router;