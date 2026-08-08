// src/routes/user.routes.ts
//
// Deprecated alias layer. /users is the canonical mount (see users.routes.ts);
// every route here calls the same controller method as its /users equivalent
// and is kept only so existing /user/* callers don't break. New clients
// should use /users/*.
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { deprecatedRoute } from '../middlewares/deprecatedRoute.js';

const router = Router();

/**
 * @openapi
 * /user/response-rate:
 *   get:
 *     tags: [User]
 *     summary: Get a user's response rate for a given date
 *     deprecated: true
 *     description: Deprecated. Use `GET /users/response-rate` instead.
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
router.get('/response-rate', deprecatedRoute('/users/response-rate'), UserController.getResponseRate);

/**
 * @openapi
 * /user/usernames/exists:
 *   get:
 *     tags: [User]
 *     summary: Check whether a username is already taken
 *     deprecated: true
 *     description: Deprecated. Use `GET /auth/usernames/exists` instead.
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
router.get('/usernames/exists', deprecatedRoute('/auth/usernames/exists'), AuthController.usernameAlreadyExists);

/**
 * @openapi
 * /user/emails/validate:
 *   get:
 *     tags: [User]
 *     summary: Check whether an email address is valid/deliverable
 *     deprecated: true
 *     description: Deprecated. Use `GET /auth/validate-email` instead.
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
router.get('/emails/validate', deprecatedRoute('/auth/validate-email'), AuthController.isValidEmail);

/**
 * @openapi
 * /user/deletions/confirm:
 *   get:
 *     tags: [User]
 *     summary: Check whether an account-deletion token is valid/pending (does not delete)
 *     deprecated: true
 *     description: >
 *       Deprecated. Use `GET /users/me/deletion-requests/{token}` to check a
 *       token, and `DELETE /users/me/deletion-requests/{token}` to confirm
 *       deletion. This GET never deletes the account -- it only reports
 *       whether the token is valid and pending.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token is valid and deletion is pending confirmation
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
router.get('/deletions/confirm', deprecatedRoute('/users/me/deletion-requests/{token}'), UserController.checkDeletionRequest);

/**
 * @openapi
 * /user/fcm-token:
 *   get:
 *     tags: [User]
 *     summary: Get a user's FCM token by username
 *     deprecated: true
 *     description: Deprecated. Use `GET /users/fcm-token` instead.
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
router.get('/fcm-token', deprecatedRoute('/users/fcm-token'), UserController.getFCMTokenByUsername);

/**
 * @openapi
 * /user:
 *   get:
 *     tags: [User]
 *     summary: Get a user by email
 *     deprecated: true
 *     description: Deprecated. Use `GET /users` instead.
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
router.get('/', deprecatedRoute('/users'), UserController.getByEmail);

/**
 * @openapi
 * /user/allow-push-notification:
 *   get:
 *     tags: [User]
 *     summary: Get the authenticated user's push-notification preference
 *     deprecated: true
 *     description: Deprecated. Use `GET /users/me/allow-push-notification` instead.
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
  deprecatedRoute('/users/me/allow-push-notification'),
  authenticateJWT,
  UserController.getAllowPushNotificationStatus
);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get a user profile by ID
 *     deprecated: true
 *     description: Deprecated. Use `GET /users/{id}` instead.
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
router.get('/:id', deprecatedRoute('/users/{id}'), UserController.fetch_user_profile);

/**
 * @openapi
 * /user:
 *   put:
 *     tags: [User]
 *     summary: Update the authenticated user's profile
 *     deprecated: true
 *     description: Deprecated. Use `PUT /users/me` instead.
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
router.put('/', deprecatedRoute('/users/me'), authenticateJWT, UserController.updateUser);

/**
 * @openapi
 * /user/picture:
 *   put:
 *     tags: [User]
 *     summary: Update the authenticated user's profile picture
 *     deprecated: true
 *     description: Deprecated. Use `PUT /users/me/picture` instead.
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
router.put('/picture', deprecatedRoute('/users/me/picture'), authenticateJWT, UserController.updatePictureUrl);

/**
 * @openapi
 * /user/toggle-push-notification:
 *   put:
 *     tags: [User]
 *     summary: Toggle the authenticated user's push-notification preference
 *     deprecated: true
 *     description: Deprecated. Use `PUT /users/me/toggle-push-notification` instead.
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
  deprecatedRoute('/users/me/toggle-push-notification'),
  authenticateJWT,
  UserController.toggleAllowPushNotifications
);

/**
 * @openapi
 * /user/fcm-token:
 *   put:
 *     tags: [User]
 *     summary: Update the authenticated user's FCM token
 *     deprecated: true
 *     description: Deprecated. Use `PUT /users/me/fcm-token` instead.
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
router.put('/fcm-token', deprecatedRoute('/users/me/fcm-token'), authenticateJWT, UserController.updateFCMToken);

/**
 * @openapi
 * /user/logout:
 *   post:
 *     tags: [User]
 *     summary: Log out and blacklist the current token
 *     deprecated: true
 *     description: Deprecated. Use `POST /auth/logout` instead.
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
router.post('/logout', deprecatedRoute('/auth/logout'), authenticateJWT, AuthController.logout);

/**
 * @openapi
 * /user/deletion-requests:
 *   post:
 *     tags: [User]
 *     summary: Request deletion of the authenticated user's account
 *     deprecated: true
 *     description: Deprecated. Use `POST /users/me/deletion-requests` instead.
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
router.post('/deletion-requests', deprecatedRoute('/users/me/deletion-requests'), authenticateJWT, UserController.deleteMyAccount);

export default router;
