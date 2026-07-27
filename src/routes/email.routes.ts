// email.routes.ts
import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';

const router = Router();

/**
 * @openapi
 * /email/sign-up:
 *   post:
 *     tags: [Email]
 *     summary: Send the welcome/signup email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to, username]
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/sign-up', EmailController.signup);

/**
 * @openapi
 * /email/password-reset:
 *   post:
 *     tags: [Email]
 *     summary: Send the password-reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to, username, token]
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/password-reset', EmailController.passwordReset);

/**
 * @openapi
 * /email/account-deletion-request:
 *   post:
 *     tags: [Email]
 *     summary: Send the account-deletion confirmation-request email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to, username, token]
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/account-deletion-request', EmailController.accountDeletionRequest);

/**
 * @openapi
 * /email/account-deletion:
 *   post:
 *     tags: [Email]
 *     summary: Send the account-deletion confirmation email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to, username]
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/account-deletion', EmailController.accountDeletion);

/**
 * @openapi
 * /email/reminder:
 *   post:
 *     tags: [Email]
 *     summary: Send the neck-angle check-in reminder email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to, username]
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/reminder', EmailController.reminder);

export default router;
