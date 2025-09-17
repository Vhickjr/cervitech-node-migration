// src/helpers/emailTemplate.ts
import { IEmailTemplates } from "./MailService"; 
import { ILogger } from "./MailService";
import { emailTemplate } from "../helpers/emailTemplate";

export class EmailTemplates implements IEmailTemplates {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  getSignUpEmail(): string {
    try {
      return emailTemplate.signUp;
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }

  getReminderEmail(): string {
    try {
      return emailTemplate.reminder;
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }

  getPasswordResetEmail(): string {
    try {
      return emailTemplate.passwordReset;
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }

  getAccountDeletionEmail(): string {
    try {
      return emailTemplate.accountDeletion;
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }

  getAccountDeletionRequestEmail(): string {
    try {
      return emailTemplate.accountDeletionRequest;
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }
}