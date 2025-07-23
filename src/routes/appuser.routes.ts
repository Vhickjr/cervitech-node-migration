import { Router } from 'express';
import { AppUserController } from '../controllers/appuser.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// AppUser authentication routes
router.post('/signup', AppUserController.signup);
router.post('/login', AppUserController.login);

// AppUser feature routes (protected)
router.put('/:userId/toggle-push-notifications', authenticateToken, AppUserController.toggleAllowPushNotifications);

export default router;
