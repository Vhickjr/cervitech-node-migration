import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/response-rate', UserController.getResponseRate);
router.get('/usernames/exists', AuthController.usernameAlreadyExists);
router.get('/emails/validate', AuthController.isValidEmail);
router.get('/deletions/confirm', UserController.confirmDeleteMyAccount);
router.get('/fcm-token', UserController.getFCMTokenByUsername);
router.get('/', UserController.getByEmail);
router.get(
  '/allow-push-notification',
  authenticateJWT,
  UserController.getAllowPushNotificationStatus
);
router.get('/:id', UserController.fetch_user_profile);
router.put('/', authenticateJWT, UserController.updateUser);
router.put('/picture', authenticateJWT, UserController.updatePictureUrl);
router.put('/subscription', authenticateJWT, UserController.updateSubscription);
router.put(
  '/toggle-push-notification',
  authenticateJWT,
  UserController.toggleAllowPushNotifications
);
router.put('/fcm-token', authenticateJWT, UserController.updateFCMToken);
router.post('/logout', authenticateJWT, AuthController.logout);
router.post('/deletion-requests', authenticateJWT, UserController.deleteMyAccount);

// DELETE routes
// router.delete('/', UserController.deleteAll);
// router.delete('/:id', UserController.deleteById);

export default router;
