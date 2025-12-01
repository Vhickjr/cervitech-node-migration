// emailTemplates.ts
import { EmailUtils } from "./emailutils";
import * as dotenv from "dotenv";
dotenv.config();


const baseUrl = process.env.BACKEND_URL;

const frontendBaseUrl = process.env.FRONTEND_URL;

export const EmailTemplates = {
  accountDeletion: (username: string) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Account Deletion Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; text-align:center">
   <!-- <h1>Account Deletion Confirmation</h1>-->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center" valign="top">
                <a href="https://cervitech.com.ng"><img style="padding-top: 60px" src="https://firebasestorage.googleapis.com/v0/b/cervitech-e4465.appspot.com/o/cervitechLogo2x.png?alt=media&token=ed03f4e5-6bdb-4a58-b7a1-b46ee385b288"></a>
            </td>
        </tr>
    </table>
    <p>Hi ${username},</p>
    <p>We have received your request to delete your account. We're sorry to see you go, but we understand that sometimes it's necessary to move on.</p>
    <p>Please note that deleting your account is a permanent action and cannot be undone. As a result, all your data and information associated with the account will be permanently removed from our system.</p>
    <p>If you have any remaining questions or concerns, please don't hesitate to reach out to our support team at contact.cervitech@gmail.com or visit our FAQ page on our website.</p>
    <p>Thank you for being a part of our community. We wish you all the best in your future endeavors.</p>
    <p>Best regards,<br>CerviTech Team</p>
</body>
</html>`;
  },

  passwordReset: (username: string, token: string) => {
    const resetLink = `${frontendBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align:center;">
        <p>Hi ${username},</p>
        <p>You requested a password reset. Click the button below to set your new password:</p>
        <a href="${resetLink}" 
           style="display:inline-block; padding:12px 24px; background-color:#4c2a7f; color:white; border-radius:5px; text-decoration:none; font-weight:bold;">
           Reset Password
        </a>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn’t request this, ignore this email.</p>
        <p>Best regards,<br>CerviTech Team</p>
      </body>
      </html>
    `;
  },


  signUp: (username: string) => {
    return `<!DOCTYPE html>
<html>
<head>
	<title>Welcome to CerviTech!</title>
</head>
<body style="font-family: Arial, sans-serif">
	<table cellpadding="0" cellspacing="0" border="0" width="100%">
		<tr>
			<td align="center" valign="top">
				<a href="https://cervitech.com.ng"><img style="padding-top: 60px" src="https://firebasestorage.googleapis.com/v0/b/cervitech-e4465.appspot.com/o/cervitechLogo2x.png?alt=media&token=ed03f4e5-6bdb-4a58-b7a1-b46ee385b288"></a>
			</td>
		</tr>
		<tr>
			<td align="center" bgcolor="#ffffff" style="padding: 40px 20px 30px 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
				<p>Hi ${username},</p>
				<p>Welcome to CerviTech! We're thrilled to have you as a new member of our community.</p>
				<p>You've taken the first step towards achieving your fitness goals. We're excited to help you along the way.</p>
				<p>Here are a few things you can do to get started:</p>
				<ul>
					<li>
						<a href="#" style="color: #4c2a7f; text-decoration:none">Log in to your account</a>
					</li>
					<li><a href="https://cervitech.com.ng/#" style="color: #4c2a7f; text-decoration: none ">Check out our getting started guide</a></li>
					<li><a href="https://cervitech.com.ng/#" style="color: #4c2a7f; text-decoration: none ">Check out our privacy policy</a></li>
					<!--<li>[Insert another action to take, such as "Follow us on social media" or "Refer a friend"]</li>-->
				</ul>
				<p>
					Get started by setting your neck angle goal, we’ll prepare a workout program to help you achieve your goals.
					We're always here to help if you have any questions or need assistance. Don't hesitate to reach out to us at <a href="tel:+234-805-964-3996">+234-805-964-3996</a>.
				</p>
				<p>Thanks again for joining CerviTech! We can't wait to see what you'll achieve.</p>
				<p>Best regards,</p>
				<p>CerviTech Team</p>
				<p>
					P.S. Keep an eye out for our emails. We'll be sending you reminders, tips and tricks or exclusive offers to help you get the most out of your experience with us
				</p>
		</tr>
	</table>

	<table style="width: 85%;" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
		<tr style="height: auto;">
			<td style="padding: 25px">
			  <p style="margin:0 0 8px 0;">CerviTech · Department of Physiotherapy · University of Lagos, Akoka · Lagos, Nigeria</p>
              <p style="margin:0;">If you no longer wish to receive these emails, <a href="{{unsubscribe_link}}" style="color:#0078d4;text-decoration:underline;">unsubscribe</a>.</p>
            </td>
			</td>
		</tr>
	</table>
</body>
</html>`;
  },

  reminder: (username: string) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    img { border:0; outline:none; text-decoration:none; display:block; }
    table { border-collapse:collapse; }
    .content { max-width:600px; width:100%; }
    .btn { display:inline-block; padding:12px 20px; background:#6a0dad; color:white; text-decoration:none; border-radius:4px; font-weight:500; }
    @media screen and (max-width:620px) {
      .content { width:100% !important; }
      img.responsive { width:90% !important; height:auto !important; }
      .pad { padding:20px !important; }
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; text-align:center">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#fff">
    <tr>
      <td align="center" valign="top">
        <a href="https://cervitech.com.ng" target="_blank" rel="noopener">
          <img class="responsive" height="120" width="450" style="padding-top:60px;display:block;border:0;" src="https://firebasestorage.googleapis.com/v0/b/cervitech-e4465.appspot.com/o/cervitechLogo2x.png?alt=media&token=ed03f4e5-6bdb-4a58-b7a1-b46ee385b288" alt="CerviTech">
        </a>
      </td>
    </tr>

    <tr>
      <td align="center" valign="top">
        <table cellpadding="0" cellspacing="0" border="0" width="600" class="content" style="background-color:#ffffff;">
          <tr>
            <td align="center" valign="top" style="padding:40px 20px;font-size:20px;line-height:24px;color:#333333;" class="pad">
              <p style="margin:0 0 12px 0;">Dear <strong>${username}</strong>,</p>
              <p style="margin:0 0 12px 0;">It's been a while since you've used our app, and we wanted to check in and see how you're doing. We hope everything is going well for you!</p>
              <p style="margin:0 0 12px 0;">If you have any questions or feedback, please don't hesitate to reach out to us. We're always here to help.</p>
              <p style="margin:0 0 18px 0;">Thanks for being a valued member of our community, and we hope to see you back in the app soon!</p>
              <p style="margin:0 0 24px 0;">Best regards,<br><strong>CerviTech Team</strong></p>

              <a class="btn" href="https://cervitech.com.ng" target="_blank" rel="noopener">Return to App</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" valign="top">
        <table style="max-width:500px;width:100%;" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
          <tr style="height:auto;">
            <td style="padding:25px;font-size:13px;line-height:18px;color:#666666;text-align:center;">
              <p style="margin:0 0 8px 0;">CerviTech · Department of Physiotherapy · University of Lagos, Akoka · Lagos, Nigeria</p>
              <p style="margin:0;">If you no longer wish to receive these emails, <a href="{{unsubscribe_link}}" style="color:#0078d4;text-decoration:underline;">unsubscribe</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}, 

accountDeletionRequest: (username: string, to: string, token: string) => {
const confirmationLink = `${baseUrl}/api/v1/user/confirmdeletemyaccount?token=${encodeURIComponent(token)}`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Account Deletion Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <a href="https://cervitech.com.ng">
          <img src="https://firebasestorage.googleapis.com/v0/b/cervitech-e4465.appspot.com/o/cervitechLogo2x.png?alt=media&token=ed03f4e5-6bdb-4a58-b7a1-b46ee385b288"
               alt="CerviTech Logo"
               style="padding-top: 20px; width: 150px;" />
        </a>
      </td>
    </tr>
  </table>

  <p style="margin-top: 20px;">Hi ${username},</p>
  <p>Thank you for using CerviTech. You've initiated the account deletion process. Please follow the link below to confirm the deletion:</p>

  <!-- Button -->
  <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top: 20px;">
    <tr>
      <td align="center" bgcolor="#653893" 
          style="
            background: linear-gradient(0deg, #2C0C56 0%, #653893 100%);
            border-radius: 5px;
          ">
        <a href="${confirmationLink}"
          style="
            display: inline-block;
            padding: 12px 25px;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            width: 200px;
            text-align: center;
            border: 1px solid #653893;
            border-radius: 5px;
          "
          target="_blank">
          Confirm Account Deletion
        </a>
      </td>
    </tr>
  </table>

  <p style="margin-top: 20px;">If you didn't request this, you can ignore this email, and your account will remain active.</p>

  <p style="margin-top: 10px;">Feel free to reach out to our support team at <b>contact.cervitech@gmail.com</b> if you have any questions or concerns.</p>

  <p style="margin-top: 20px;">Best regards,<br>CerviTech Team</p>

</body>
</html>
`;
}

};