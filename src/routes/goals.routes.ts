// goals.routes.ts
import { Router } from 'express';
import {
  turnOnGoalByUserId,
  turnOffGoalByUserId,
  getGoalsByUserId,
  getCurrentTargetedAverageNeckAngle
} from '../controllers/goal.controller';

const router = Router();

router.post('/turn-on', turnOnGoalByUserId);
router.put('/turn-off', turnOffGoalByUserId);
router.get('/user-goals', getGoalsByUserId);
router.get('/neck-angle', getCurrentTargetedAverageNeckAngle);

export default router;
