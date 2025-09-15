// routes/neckAngleRoutes.ts
import express from 'express';
import { NeckAngleController } from '../controllers/neckAngle.controller';

const router = express.Router();

router.post('/neckangle/postBatchNeckAngleRecords', NeckAngleController.postBatchNeckAngleRecords);
router.post('/neckangle/postrandomneckanglerecords', NeckAngleController.postRandomTestBatchNeckAngleRecords);
router.post('/neckangle/sendPushNotificationMessageForAverageNeckAngle', NeckAngleController.sendPushNotificationMessageForAverageNeckAngle);
router.post('/neckangle/resetNotificationCount/:userId', NeckAngleController.resetNotificationCount);
router.get('/neckangle/getUsersForTesting', NeckAngleController.getUsersForTesting);
router.get('/neckangle/getCurrentDayAverageNeckAngleTextReport', NeckAngleController.getCurrentDayAverageNeckAngleTextReport);

export default router;
