// email.routes.ts
import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';

const router = Router();

router.post('/sign-up', EmailController.signup);
router.post('/password-reset', EmailController.passwordReset);
router.post('/account-deletion-request', EmailController.accountDeletionRequest);
router.post('/account-deletion', EmailController.accountDeletion);
router.post('/reminder', EmailController.reminder);

export default router;
