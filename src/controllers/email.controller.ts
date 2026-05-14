import { EmailUtils } from "../utils/EmailService/emailutils";
import { Request, Response } from "express";

export class EmailController {
  static async signup(req: Request, res: Response) {
    const { to, username } = req.body;

    try {
      const result = await EmailUtils.sendSignupEmail(to, username);
      res.status(200).json({ message: "Signup email sent successfully", result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send signup email" });
    }
  }

  static async reminder(req: Request, res: Response) {
    const { to, username } = req.body;

    try {
      const result = await EmailUtils.sendReminderEmail(to, username);
      res.status(200).json({ message: "Reminder email sent successfully", result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send reminder email" });
    }
  }

  static async passwordReset(req: Request, res: Response) {
    const { to, username, token } = req.body; // lowercase 'token'

    try {
      const result = await EmailUtils.sendPasswordResetEmail(to, username, token);
      res.status(200).json({ message: "Password reset email sent successfully", result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send password reset email" });
    }
  }

  static async accountDeletionRequest(req: Request, res: Response) {
    const { to, username, token } = req.body;

    try {
      const result = await EmailUtils.sendAccountDeletionRequest(to, username, token);
      res.status(200).json({ message: "Account deletion request email sent successfully", result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send deletion request email" });
    }
  }

  static async accountDeletion(req: Request, res: Response) {
    const { to, username } = req.body;

    try {
      const result = await EmailUtils.sendAccountDeletionConfirmation(to, username);
      res.status(200).json({ message: "Account deletion confirmation email sent successfully", result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send deletion confirmation email" });
    }
  }
}
