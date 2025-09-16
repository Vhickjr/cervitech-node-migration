// src/helpers/EmailTemplates.ts
import fs from "fs";
import path from "path";
import { IEmailTemplates } from "./MailService"; 
import { ILogger } from "./MailService";

export class EmailTemplates implements IEmailTemplates {
  private rootPath: string;
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.rootPath = process.cwd(); 
    this.logger = logger;
  }
 
  private loadTemplate(fileName: string): string {
    try {
      const filePath = path.join(this.rootPath, "src", "EmailTemplates", fileName);
      const html = fs.readFileSync(filePath, "utf-8");
      return html;
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }

  getSignUpEmail(): string {
    return this.loadTemplate("signup.html");
  }

  getReminderEmail(): string {
    return this.loadTemplate("reminder.html");
  }

  getPasswordResetEmail(): string {
    return this.loadTemplate("passwordreset.html");
  }

  getAccountDeletionEmail(): string {
    return this.loadTemplate("accountdeletion.html");
  }

  getAccountDeletionRequestEmail(): string {
    return this.loadTemplate("accountdeletionrequest.html");
  }
}
