"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridEmailSender = void 0;
// src/helpers/SendGridEmailSender.ts
const sgMail = __importStar(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SendGridEmailSender {
    constructor(emailTemplates) {
        this.apiKey = process.env.SENDGRID_API_KEY || '';
        this.emailTemplates = emailTemplates;
        sgMail.setApiKey(this.apiKey);
    }
    async sendBulkEmailAsync(emails, subject, message) {
        const msg = {
            to: emails,
            from: {
                email: 'devs.cervitech@gmail.com',
                name: 'CerviTech Mobile',
            },
            subject,
            text: message,
            html: message,
        };
        await sgMail.sendMultiple(msg);
    }
    async sendEmailAsync(email, subject, message) {
        const msg = {
            to: email,
            from: {
                email: 'devs.cervitech@gmail.com',
                name: 'CerviTech Mobile',
            },
            subject,
            text: message,
            html: message,
        };
        await sgMail.send(msg);
    }
    async sendWelcomeEmail(email, name) {
        const subject = 'Welcome to Cervitech';
        let body = this.emailTemplates.getSignUpEmail();
        body = body.replace('[NAME]', name).replace('[EMAILHOLDER]', email);
        const msg = {
            to: email,
            from: {
                email: 'devs.cervitech@gmail.com',
                name: 'CerviTech Mobile',
            },
            subject,
            text: body,
            html: body,
        };
        await sgMail.send(msg);
    }
    async sendTestEmail() {
        const msg = {
            to: {
                email: 'ogunderoayodeji@gmail.com',
                name: 'Micheal',
            },
            from: {
                email: 'devs.cervitech@gmail.com',
                name: 'CerviTech Mobile',
            },
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with TypeScript',
            html: '<strong>and easy to do anywhere, even with TypeScript</strong>',
        };
        await sgMail.send(msg);
    }
}
exports.SendGridEmailSender = SendGridEmailSender;
