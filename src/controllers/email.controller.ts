import { Emailutils } from "../utils/EmailService/emailutils";
import { Request, Response } from "express";

export class EmailController {
    static async signup(req: Request, res: Response) {
    const { to, username } = req.body;

    try {
      const result = await Emailutils.Signup(to, username);
      res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to send email' });
    }
  }

  static async reminder(req: Request, res: Response) {
    const { to, username } = req.body;

    try {
      const result = await Emailutils.Reminder(to, username);
      res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to send email' });
    }
  }

  static async passwordReset(req: Request, res: Response) {
    const { to, username, Token } = req.body;

    try {
      const result = await Emailutils.PasswordReset(to, username, Token);
      res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to send email' });
    }
  }

  static async accountDeletionRequest(req: Request, res: Response) {
    const { to, username } = req.body;

    try {
      const result = await Emailutils.AccountDeletionRequestEmail(to, username);
      res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to send email' });
    }
  }

  static async accountDeletion(req: Request, res: Response) {
    const { to, username } = req.body;

    try {
      const result = await Emailutils.AccountDeletion(to, username);
      res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to send email' });
    }
  }
}

