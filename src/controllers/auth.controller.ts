// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
    },
  async requestReset(req: Request, res: Response){
     try{
      const result = await AuthService.requestPasswordReset(req.body);
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
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      // Send back logout confirmation
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Logout failed' });
    }
  },

};