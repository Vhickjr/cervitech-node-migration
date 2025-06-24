// src/services/mail.service.ts

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const resetLink = `https://yourfrontend.com/reset-password?token=${token}`;

  const mailOptions = {
    from: '"Your App" <no-reply@yourapp.com>',
    to,
    subject: 'Reset Your Password',
    text: `Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.`,
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
