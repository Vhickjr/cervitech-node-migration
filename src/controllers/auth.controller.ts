import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { TokenUtil } from '../utils/token.util';
import TokenBlacklist from '../models/TokenBlacklist';
import { logger } from '../utils/logger';

export const AuthController = {
  // -------------------------
  // Signup (legacy-safe)
  // -------------------------
  async signup(req: Request, res: Response) {
    try {
      const body = {
        username: (req.body.Username ?? req.body.username)?.toLowerCase?.(),
        firstName: req.body.FirstName ?? req.body.firstName,
        lastName: req.body.LastName ?? req.body.lastName,
        email: (req.body.Email ?? req.body.email)?.toLowerCase?.(),
        password: req.body.Password ?? req.body.password,
        confirmPassword: req.body.ConfirmPassword ?? req.body.confirmPassword,
        mobileChannel: req.body.MobileChannel ?? req.body.mobileChannel,
        fcmToken: req.body.FCMToken ?? req.body.fcmToken,
        pictureUrl: req.body.PictureUrl ?? req.body.pictureUrl,
      };

      const result = await AuthService.signup(body);

      if (!result.success) {
        logger.warn('User signup failed', { email: body.email, message: result.message });
        return res.status(400).json({ success: false, message: result.message });
      }

      logger.info('User signed up successfully', { email: body.email });
      return res.status(201).json(result);
    } catch (err: any) {
      logger.error('User signup failed (unexpected)', { error: err.message });
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error during signup' });
    }
  },

  // -------------------------
  // Authenticate/Login (legacy-safe)
  // -------------------------
  async authenticate(req: Request, res: Response) {
    try {
      const body = {
        emailOrUsername: (
          req.body.EmailOrUsername ??
          req.body.emailOrUsername ??
          req.body.email
        )?.toLowerCase(),
        password: req.body.Password ?? req.body.password,
        mobileChannel: req.body.MobileChannel ?? req.body.mobileChannel,
      };

      const result = await AuthService.authenticatev1(body);

      if (!result.success) {
        logger.warn('Authentication failed', {
          emailOrUsername: body.emailOrUsername,
          message: result.message,
        });
        return res.status(400).json({ success: false, message: result.message });
      }

      logger.info('Authentication successful', { emailOrUsername: body.emailOrUsername });
      return res.status(200).json(result);
    } catch (err: any) {
      logger.error('Authentication failed (unexpected)', { error: err.message });
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error during authentication' });
    }
  },

  // -------------------------
  // Logout (blacklist token)
  // -------------------------
  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = req.user?.userId ?? req.body.UserId ?? req.body.userId;

      if (!userId) return res.status(401).json({ success: false, message: 'User ID missing' });
      if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

      await TokenBlacklist.create({ token });
      const result = await AuthService.logout({ userId, token });

      if (!result.success) return res.status(400).json({ success: false, message: result.message });
      return res.status(200).json(result);
    } catch (err: any) {
      logger.error('Logout failed', { error: err.message });
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error during logout' });
    }
  },

  // -------------------------
  // Change password
  // -------------------------
  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const formerPassword = req.body.FormerPassword ?? req.body.formerPassword;
      const newPassword = req.body.NewPassword ?? req.body.newPassword;

      if (!userId) return res.status(401).json({ success: false, message: 'User ID missing' });
      if (!formerPassword || !newPassword)
        return res
          .status(401)
          .json({ success: false, message: 'Former password or New password is missing' });

      const result = await AuthService.changePassword(userId, formerPassword, newPassword);

      if (!result.success) return res.status(401).json({ success: false, message: result.message });

      return res.status(200).json(result);
    } catch (err: any) {
      logger.error('Password change failed', { error: err.message });
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error during logout' });
    }
  },

  // -------------------------
  // Send password reset token
  // -------------------------
  async sendPasswordToken(req: Request, res: Response) {
    try {
      const email = req.body.Email ?? req.body.email ?? req.query.email;
      if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

      const result = await AuthService.sendPasswordResetToken(email);
      if (!result?.success) return res.status(400).json(result);

      return res.status(200).json(result);
    } catch (err: any) {
      logger.error('SendPasswordToken failed', { error: err.message });
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // -------------------------
  // Reset password (legacy-safe)
  // -------------------------
  async resetPassword(req: Request, res: Response) {
    try {
      const token = req.body.Token ?? req.body.token ?? req.query.token;
      const newPassword =
        req.body.NewPassword ?? req.body.newPassword ?? req.body.ConfirmNewPassword;

      if (!token || !newPassword)
        return res.status(400).json({ success: false, message: 'Token and password are required' });

      const result = await AuthService.resetPassword({token, newPassword});
      await TokenBlacklist.create({ token });

      return res.status(200).json(result);
    } catch (err: any) {
      logger.error('ResetPassword failed', { error: err.message });
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // -------------------------
  // Username exists
  // -------------------------
  async usernameAlreadyExists(req: Request, res: Response) {
    try {
      const username = (req.query.Username ?? req.query.username) as string;
      if (!username)
        return res.status(400).json({ success: false, message: 'Username is required' });

      const exists = await AuthService.usernameAlreadyExists(username);
      return res.status(200).json({ exists });
    } catch (err: any) {
      logger.error('usernameAlreadyExists failed', { error: err.message });
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // -------------------------
  // Validate email
  // -------------------------
  async isValidEmail(req: Request, res: Response) {
    try {
      const body = req.body ?? {};
      const email = body.Email ?? body.email ?? req.query.Email ?? req.query.email;
      if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

      const isValid = await AuthService.isValidEmail(email);
      return res.status(200).json({ isValid });
    } catch (err: any) {
      logger.error('isValidEmail failed', { error: err.message });
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
