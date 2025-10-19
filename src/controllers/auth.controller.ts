// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
// import { CustomException } from '../helpers/CustomException';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

import { logger } from '../utils/logger.js';

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body);
      if (result.success === false) {
        logger.warn('User signup failed', { email: req.body.email, message: result.message });
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      logger.info('User signed up successfully', { email: req.body.email });
      res.status(201).json(result);
    } catch (err: any) {
      logger.error('User signup failed.(Unexpected internal error)', {
        email: req.body.email,
        error: err.message,
      });
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred during signup',
      });
    }
  },

  async sendPasswordToken(req: Request, res: Response) {
    try {
      const result = await AuthService.sendPasswordResetToken(req.body);
      if (result.success === false) {
        logger.warn('Sending password token failed', {
          email: req.body.email,
          message: result.message,
        });
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
      logger.info('Password token sent successfully.', { email: req.body.email });
      res.status(200).json(result);
    } catch (err: any) {
      logger.error('Sending password token failed (Unexpected internal error)', {
        email: req.body.email,
        error: err.message,
      });
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while sending password token',
      });
    }
  },


  async resetPassword(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const {newPassword} = req.body;

      if(!token){
        return res.status(400).json({
          success: false,
          message: 'Token is required in the Authorization header'
        });
      }
      const result = await AuthService.resetPassword({token, newPassword});
      if (result.success === false) {
        logger.warn('Password reset  failed', { message: result.message });
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
      logger.info('Password reset successfully');
      res.status(200).json(result);
    } catch (err: any) {
      console.log(err);
      logger.error('Password reset failed. (Unexpected internal error)', {
        error: err.message,
      });
      res.status(500).json({
        success: false,
        message: `Internal server error occurred while resetting password: ${err}`
      });
    }
  },
  /*  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.body.userId;

            if (userId === "") {
                res.status(400).json({ message: 'Invalid or missing userId' });
                return;
            }

            const result = await AuthService.logout(userId);

            if (result) {
                res.status(200).json({ message: 'Logout successful' });
            } else {
                res.status(500).json({ message: 'Logout failed' });
            }
        } catch (error) {
            if (error instanceof CustomException) {
                res.status(404).json({ message: error.message });
            }
        }
    },

  async authenticate(req: Request, res: Response): Promise<void> {
      try {
        const { emailOrUsername, password, mobileChannel } = req.body;
  
        if (
          !emailOrUsername ||
          typeof emailOrUsername !== 'string' ||
          !password ||
          typeof password !== 'string' ||
          !['ANDROID', 'IOS', 'OTHER'].includes(mobileChannel)
        ) {
          res.status(400).json({
            message:
              'Invalid login request. Please provide emailOrUsername, password, and a valid mobileChannel (1 or 2).'
          });
          return;
        }
  
        const user = await AuthService.authenticate({ emailOrUsername, password, mobileChannel });
        res.status(200).json(user);
      } catch (error: any) {
        if (error instanceof CustomException) {
          res.status(401).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    }
  }, */

  async authenticate(req: Request, res: Response) {
    try {
      const result = await AuthService.authenticatev1(req.body);
      if (result.success === false) {
        logger.warn('Authentication / Login failed', {
          emailOrUsername: req.body.emailOrUsername,
          message: result.message,
        });
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      logger.info('Authentication successful', {
        emailOrUsername: req.body.emailOrUsername,
        message: result.message,
      });
      res.status(200).json(result);
    } catch (err: any) {
      logger.error('Authentication failed. (Unexpected internal error)', {
        emailOrUsername: req.body.emailOrUsername,
        error: err.message,
      });
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while authenticating user',
      });
    }
  },

  /*   async logout(req: Request, res: Response) {
    try {
      // Send back logout confirmation
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }, */

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;
      const token = req.headers.authorization?.split(' ')[1];

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Authentication failed. User ID missing.' });
      }
      if (!token) {
        return res
          .status(400)
          .json({ success: false, message: 'Token is required in the header.' });
      }

      const result = await AuthService.logout({ userId, token });
      if (result.success === false) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json(result);

    } catch (err: any) {
      logger.error('Logout failed. (Unexpected internal error)', {
        userId: req.userId,
        error: err.message,
      });
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while logging user',
      });
    }
  },
};
