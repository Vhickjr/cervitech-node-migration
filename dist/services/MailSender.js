"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSender = void 0;
// src/helpers/MailSender.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MailSender {
    constructor(logger) {
        this.logger = logger;
        this.cerviTechEmail = process.env.CERVITECH_EMAIL || '';
        this.cerviTechEmailPassword = process.env.CERVITECH_EMAIL_PASSWORD || '';
        this.port = parseInt(process.env.EMAIL_SERVER_PORT || '587');
    }
    async sendEmail(emailAddress, subject, message) {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: 'smtp.live.com', // or smtp.gmail.com
                port: this.port,
                secure: false,
                auth: {
                    user: this.cerviTechEmail,
                    pass: this.cerviTechEmailPassword,
                },
            });
            const mailOptions = {
                from: `"CerviTech" <${this.cerviTechEmail}>`,
                to: emailAddress,
                subject: subject || 'Test Email Subject',
                text: message || 'Example Plain Text Message Body',
            };
            await transporter.sendMail(mailOptions);
            this.logger.logError('Email sent successfully');
            return 'The mail has been sent successfully !!';
        }
        catch (error) {
            this.logger.logError('Error in sending mail');
            this.logger.logError(error.message);
            return 'sorry cannot send mail';
        }
    }
}
exports.MailSender = MailSender;
