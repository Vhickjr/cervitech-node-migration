import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

router.get('/', (req, res) => {
  res.send('🚀 CerviTech API is running!');
});

router.post('/:userId/toggleallowpushnotifications', UserController.toggleAllowPushNotifications);

export default router;
