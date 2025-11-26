// routes/neckAngleRoutes.ts
import express from 'express';
import { NeckAngleController } from '../controllers/neckAngle.controller';

const router = express.Router();

<<<<<<< HEAD
router.post('/neckangle/postBatchNeckAngleRecords', NeckAngleController.postBatchNeckAngleRecords);
router.post('/neckangle/postrandomneckanglerecords', NeckAngleController.postRandomTestBatchNeckAngleRecords);
router.post('/neckangle/sendPushNotificationMessageForAverageNeckAngle', NeckAngleController.sendPushNotificationMessageForAverageNeckAngle);
router.post('/neckangle/resetNotificationCount/:userId', NeckAngleController.resetNotificationCount);
router.get('/neckangle/getUsersForTesting', NeckAngleController.getUsersForTesting);
router.get('/neckangle/getCurrentDayAverageNeckAngleTextReport', NeckAngleController.getCurrentDayAverageNeckAngleTextReport);
=======
router.post('/postBatchNeckAngleRecords', NeckAngleController.postBatchNeckAngleRecords);
router.post('/postrandomneckanglerecords', NeckAngleController.postRandomTestBatchNeckAngleRecords);
router.post("/weekly-averages", NeckAngleController.getWeeklyNeckAngleAverages);
>>>>>>> 007d4a6 (implemented get each week of the month average neck angle feature)

export default router;
