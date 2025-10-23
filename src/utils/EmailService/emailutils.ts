import { EmailClient } from '@azure/communication-email';
import * as dotenv from 'dotenv';
import { EmailTemplates } from './emailtemplates';
import { TokenUtil } from '../token.util';
dotenv.config();

export class Emailutils {
// ✅ Static class-level constants
  public static connectionString = process.env.ACS_CONNECTION_STRING!;
  public static sender = process.env.SENDER_EMAIL!;
  public static client = new EmailClient(Emailutils.connectionString);

  static async AccountDeletionRequestEmail(to: string, username: string) {
    const token = TokenUtil.generateToken('', to);
    const html = EmailTemplates.accountDeletionRequest(username, to, token);
    const poller = await Emailutils.client.beginSend(EmailTemplates.MessageTemplate(to, 'Account Deletion Request', html));
    const response = await poller.pollUntilDone();

    return response;
  }

  static async AccountDeletion(to: string, username: string) {
    const html = EmailTemplates.accountDeletion(username);
    const poller = await Emailutils.client.beginSend(EmailTemplates.MessageTemplate(to, 'Account Deletion Confirmed!', html));
    const response = await poller.pollUntilDone();

    return response;
  }

  static async PasswordReset(to: string, username: string, Token: string) {
    const html = EmailTemplates.passwordReset(username, Token);
    const poller = await Emailutils.client.beginSend(EmailTemplates.MessageTemplate(to, 'Password Reset Request', html));
    const response = await poller.pollUntilDone();

    return response;
  }

  static async Reminder(to: string, username: string) {
    const html = EmailTemplates.reminder(username);
    const poller = await Emailutils.client.beginSend(EmailTemplates.MessageTemplate(to, 'Checking In - We Miss You at CerviTech!', html));
    const response = await poller.pollUntilDone();

    return response;
  }

  static async Signup(to: string, username: string) {
    const html = EmailTemplates.signUp(username);
    const poller = await Emailutils.client.beginSend(EmailTemplates.MessageTemplate(to, 'Welcome', html));
    const response = await poller.pollUntilDone();

    return response;
  }
}