const nodemailer = require('nodemailer');
require('dotenv').config();  

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = (userEmail, token, userFirstname) => {
  const verificationLink = `${process.env.BASE_URL}/signup/verify-email?token=${token}`;

  const mailOptions = {
    from: `"User Registration" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Action Required: Verify Your Email Address',
    text: `Hello ${userFirstname},
  
  Thank you for registering with us! To complete your registration, please verify your email address by clicking the link below:
  
  ${verificationLink}
  
  This verification link will expire in 1 hour. If you did not create this account, please ignore this email.
  
  Best regards,
  The User Registration Team`,
    html: `
      <p>Hello <strong>${userFirstname}</strong>,</p>
      <p>Thank you for registering with us! To complete your registration, please verify your email address by clicking the button below:</p>
      
      <!-- Verification Button -->
      <p style="text-align: center;">
        <a href="${verificationLink}" style="display: inline-block; padding: 15px 30px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">Verify Your Email</a>
      </p>
      
      <p><strong>Note:</strong> This verification link will expire in <strong>1 hour</strong>. If you did not create this account, please ignore this email.</p>
      <p>Best regards,</p>
      <p><em>The User Registration Team</em></p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

module.exports = { sendVerificationEmail };