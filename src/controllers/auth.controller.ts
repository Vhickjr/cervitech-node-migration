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
      logger.info('User signed up successfully', { email: req.body.email });
      res.status(201).json(result);
    } catch (err: any) {
      logger.error('User signup failed', { email: req.body.email, error: err.message });
      res.status(400).json({ error: err.message });
    }
    },
  async sendPasswordToken(req: Request, res: Response){
     try{
      const result = await AuthService.sendPasswordResetToken(req.body);
      res.status(200).json(result);
      } catch (err: any) {
        res.status(400).json({ error: err.message });
     }
  },
  async resetPassword(req: Request, res: Response){
    try{
      const result = await AuthService.resetPassword(req.body);
      logger.info('Password reset successfully', { email: req.body.email });
      res.status(200).json(result);
    } catch(err: any){
      logger.error('Password reset failed', { email: req.body.email, error: err.message });
      res.status(400).json({error: err.message});
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
      const model = req.body;
      const authenticatedResult = await AuthService.authenticate(model);
      res.status(200).json(authenticatedResult);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
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

      const result = await AuthService.logout(userId!, token!);

      res.status(200).json({
        message: "Logged out successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Logout failed" });
    }
  },

  async usernameAlreadyExists(req: Request, res: Response): Promise<void> {
      try {
        const { username } = req.body;
        const exists = await AuthService.usernameAlreadyExists(username);
        res.status(200).json({ exists });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
  },

  async isValidEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const isValid = await AuthService.isValidEmail(email);
      res.status(200).json({ isValid });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

};