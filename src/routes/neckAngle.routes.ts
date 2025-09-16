// routes/neckAngleRoutes.ts
import express from 'express';
import { NeckAngleController } from '../controllers/neckAngle.controller';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/neckangle/postBatchNeckAngleRecords', NeckAngleController.postBatchNeckAngleRecords);
router.post('/neckangle/postrandomneckanglerecords', NeckAngleController.postRandomTestBatchNeckAngleRecords);
router.get('/neck-angle-stats', authenticateJWT, NeckAngleController.getMyNeckAngleStatistics);

export default router;
