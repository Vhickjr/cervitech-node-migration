// routes/neckAngleRoutes.ts
import express from 'express';
import { NeckAngleController } from '../controllers/neckAngle.controller';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.post('/neckangle/postBatchNeckAngleRecords', NeckAngleController.postBatchNeckAngleRecords);
router.post('/neckangle/postrandomneckanglerecords', NeckAngleController.postRandomTestBatchNeckAngleRecords);
router.get('/neck-angle-stats', authenticateJWT, NeckAngleController.getUserNeckAngleStatistics);
//// router.post('/neckangle/sendPushNotificationMessageForAverageNeckAngle', NeckAngleController.sendPushNotificationMessageForAverageNeckAngle);   
// //the sendPushNotificationMessageForAverageNeckAngle was commented out in neck angle controller
router.post('/neckangle/resetNotificationCount/:userId', NeckAngleController.resetNotificationCount);
router.get('/neckangle/getUsersForTesting', NeckAngleController.getUsersForTesting);
router.get('/neckangle/getCurrentDayAverageNeckAngleTextReport', NeckAngleController.getCurrentDayAverageNeckAngleTextReport);
router.post('/postBatchNeckAngleRecords', NeckAngleController.postBatchNeckAngleRecords);
router.post('/postrandomneckanglerecords', NeckAngleController.postRandomTestBatchNeckAngleRecords);
router.post("/weekly-averages", NeckAngleController.getWeeklyNeckAngleAverages);

export default router;
