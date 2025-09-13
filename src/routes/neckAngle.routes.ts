// routes/neckAngleRoutes.ts
import express from 'express';
import { NeckAngleController } from '../controllers/neckAngle.controller';

const router = express.Router();

router.post('/postBatchNeckAngleRecords', NeckAngleController.postBatchNeckAngleRecords);
router.post('/postrandomneckanglerecords', NeckAngleController.postRandomTestBatchNeckAngleRecords);
router.post("/weekly-averages", NeckAngleController.getWeeklyNeckAngleAverages);

export default router;
