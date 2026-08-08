import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /user/response-rate:
 *   get:
 *     tags: [User]
 *     summary: Get a user's response rate for a given date
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Response rate computed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: Missing/invalid id or date
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/response-rate', UserController.getResponseRate);

/**
 * @openapi
 * /user/usernames/exists:
 *   get:
 *     tags: [User]
 *     summary: Check whether a username is already taken
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Whether the username exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 */
router.get('/usernames/exists', AuthController.usernameAlreadyExists);

/**
 * @openapi
 * /user/emails/validate:
 *   get:
 *     tags: [User]
 *     summary: Check whether an email address is valid/deliverable
 *     parameters:
 *       - in: query
 *         name: Email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Whether the email is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 */
router.get('/emails/validate', AuthController.isValidEmail);

/**
 * @openapi
 * /user/deletions/confirm:
 *   get:
 *     tags: [User]
 *     summary: Confirm account deletion using a token (e.g. from an email link)
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: Token missing, already used, or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/deletions/confirm', UserController.confirmDeleteMyAccount);

/**
 * @openapi
 * /user/fcm-token:
 *   get:
 *     tags: [User]
 *     summary: Get a user's FCM token by username
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     fcmToken:
 *                       type: string
 *       404:
 *         description: User not found
 */
router.get('/fcm-token', UserController.getFCMTokenByUsername);

/**
 * @openapi
 * /user:
 *   get:
 *     tags: [User]
 *     summary: Get a user by email
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: User found
 *       400:
 *         description: Email missing
 *       404:
 *         description: User not found
 */
router.get('/', UserController.getByEmail);

/**
 * @openapi
 * /user/allow-push-notification:
 *   get:
 *     tags: [User]
 *     summary: Get the authenticated user's push-notification preference
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preference retrieved
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 */
router.get(
  '/allow-push-notification',
  authenticateJWT,
  UserController.getAllowPushNotificationStatus
);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get a user profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       400:
 *         description: Id missing
 *       404:
 *         description: User not found
 */
router.get('/:id', UserController.fetch_user_profile);

/**
 * @openapi
 * /user:
 *   put:
 *     tags: [User]
 *     summary: Update the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: User ID missing, or update failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.put('/', authenticateJWT, UserController.updateUser);

/**
 * @openapi
 * /user/picture:
 *   put:
 *     tags: [User]
 *     summary: Update the authenticated user's profile picture
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pictureUrl]
 *             properties:
 *               pictureUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Picture updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: User ID or picture URL missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: User not found
 */
router.put('/picture', authenticateJWT, UserController.updatePictureUrl);

/**
 * @openapi
 * /user/subscription:
 *   put:
 *     tags: [User]
 *     summary: Upgrade/renew the authenticated user's subscription
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: User ID missing, or update failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.put('/subscription', authenticateJWT, UserController.updateSubscription);

/**
 * @openapi
 * /user/toggle-push-notification:
 *   put:
 *     tags: [User]
 *     summary: Toggle the authenticated user's push-notification preference
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preference toggled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: User ID missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.put(
  '/toggle-push-notification',
  authenticateJWT,
  UserController.toggleAllowPushNotifications
);

/**
 * @openapi
 * /user/fcm-token:
 *   put:
 *     tags: [User]
 *     summary: Update the authenticated user's FCM token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fcmToken]
 *             properties:
 *               fcmToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: fcmToken missing/invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Not authenticated
 */
router.put('/fcm-token', authenticateJWT, UserController.updateFCMToken);

/**
 * @openapi
 * /user/logout:
 *   post:
 *     tags: [User]
 *     summary: Log out and blacklist the current token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/logout', authenticateJWT, AuthController.logout);

/**
 * @openapi
 * /user/deletion-requests:
 *   post:
 *     tags: [User]
 *     summary: Request deletion of the authenticated user's account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deletion request submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: Email missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Account not found
 */
router.post('/deletion-requests', authenticateJWT, UserController.deleteMyAccount);

export default router;
