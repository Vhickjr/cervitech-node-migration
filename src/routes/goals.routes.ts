// goals.routes.ts
import { Router } from 'express';
import { GoalController } from '../controllers/goal.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/turn-on', authenticateJWT, GoalController.turnOnGoalByUserId);
router.put('/turn-off', authenticateJWT, GoalController.turnOffGoalByUserId);
router.get('/user-goals', authenticateJWT, GoalController.getGoalsByUserId);
router.get('/neck-angle', authenticateJWT, GoalController.getCurrentTargetedAverageNeckAngle);

// Test/dev endpoints (no auth)
router.get('/test-push', GoalController.testPush);
router.post('/test-scheduler', GoalController.testScheduler);
router.post('/stop-scheduler', GoalController.stopScheduler);

export default router;
