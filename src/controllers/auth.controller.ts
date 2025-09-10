// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CustomException } from '../helpers/CustomException';

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json(result);
    } catch (err: any) {
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
      res.status(200).json(result);
    } catch(err: any){
      res.status(400).json({error: err.message});
    }
  },
  async login(req: Request, res: Response) {
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

};