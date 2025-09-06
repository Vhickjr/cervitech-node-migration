// goals.routes.ts
import { Router } from 'express';
import { FCMController } from '../controllers/fcmToken.controller';

const router = Router();

router.post('/update-FCM', FCMController.updateFCMToken);

export default router;
