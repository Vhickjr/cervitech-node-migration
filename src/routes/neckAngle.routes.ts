// routes/neckAngleRoutes.ts
import express from 'express';
import { NeckAngleController } from '../controllers/neckAngle.controller';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

//// router.post('/neckangle/sendPushNotificationMessageForAverageNeckAngle', NeckAngleController.sendPushNotificationMessageForAverageNeckAngle);
// //the sendPushNotificationMessageForAverageNeckAngle was commented out in neck angle controller
router.post('/records/batch', NeckAngleController.postBatchNeckAngleRecords);
router.post('/records/random', NeckAngleController.postRandomTestBatchNeckAngleRecords);
router.get('/stats', authenticateJWT, NeckAngleController.getUserNeckAngleStatistics);
router.post(
  '/notification-count/reset',
  authenticateJWT,
  NeckAngleController.resetNotificationCount
);
router.get('/test-users', NeckAngleController.getUsersForTesting);
router.get('/reports/current-day', NeckAngleController.getCurrentDayAverageNeckAngleTextReport);
router.post('/weekly-averages', NeckAngleController.getWeeklyNeckAngleAverages);

export default router;
