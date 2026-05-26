import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Static GET routes
router.get('/response-rate', UserController.getResponseRate);
router.get('/usernames/exists', AuthController.usernameAlreadyExists);
router.get('/emails/validate', AuthController.isValidEmail);
router.get('/deletions/confirm', UserController.confirmDeleteMyAccount);
router.get('/fcm-token', UserController.getFCMTokenByUsername);
router.get('/', UserController.getByEmail);

// Parametric GET routes
router.get(
  '/allow-push-notification',
  authenticateJWT,
  UserController.getAllowPushNotificationStatus
);
router.get('/:id', UserController.fetch_user_profile);

// Static PUT routes
router.put('/', authenticateJWT, UserController.updateUser);
router.put('/picture', authenticateJWT, UserController.updatePictureUrl);

// Parametric PUT routes
router.put('/:id/subscription', UserController.updateSubscription);
router.put('/:id/push-notifications', UserController.toggleAllowPushNotifications);
router.put('/:id/fcm-token', UserController.updateFCMToken);

// Static POST routes
router.post('/logout', authenticateJWT, AuthController.logout);
router.post('/deletion-requests', UserController.deleteMyAccount);

// DELETE routes
router.delete('/', UserController.deleteAll);
router.delete('/:id', UserController.deleteById);

export default router;
