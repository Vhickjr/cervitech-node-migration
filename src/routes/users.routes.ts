// src/routes/users.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [User]
 *     summary: "[Back office] Delete an app user's account by ID"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
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
 *       403:
 *         description: Authenticated, but not a back-office user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.delete('/:id', authenticateJWT, authorizeRole('BACKOFFICE_USER'), UserController.deleteById);

/**
 * @openapi
 * /users/me/deletion-requests/{token}:
 *   get:
 *     tags: [User]
 *     summary: Check whether an account-deletion token is valid/pending (does not delete)
 *     parameters:
 *       - in: path
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
 *         description: Token missing, already used, invalid, or not an account-deletion token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/me/deletion-requests/:token', UserController.checkDeletionRequest);

/**
 * @openapi
 * /users/me/deletion-requests/{token}:
 *   delete:
 *     tags: [User]
 *     summary: Confirm account deletion using a token (e.g. from an email link)
 *     parameters:
 *       - in: path
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
 *         description: Token missing, already used, invalid, or not an account-deletion token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.delete('/me/deletion-requests/:token', UserController.confirmDeleteMyAccount);

export default router;
