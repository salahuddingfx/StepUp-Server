const resend = require('../config/mail.config');

const sendOTPEmail = async (email, name, otpCode) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0;">
      <h2 style="color: #FF1D25; text-align: center;">English StepUp</h2>
      <p>Hello ${name},</p>
      <p>Thank you for choosing English StepUp. Use the verification code below to verify your email address or complete your request:</p>
      <div style="background-color: #F3F4F6; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 15px; margin: 20px 0; border-radius: 4px;">
        ${otpCode}
      </div>
      <p>This code is valid for 10 minutes. Please do not share this code with anyone.</p>
      <br>
      <p>Best regards,<br>The English StepUp Team</p>
    </div>
  `;

  return await resend.emails.send({
    from: process.env.EMAIL_FROM || 'English StepUp <noreply@englishstepup.com>',
    to: email,
    subject: 'English StepUp - Verification Code',
    html
  });
};

const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0;">
      <h2 style="color: #FF1D25; text-align: center;">Welcome to English StepUp!</h2>
      <p>Hello ${name},</p>
      <p>Welcome to English StepUp - Empowering Growth through Modern English Learning. We're thrilled to have you with us!</p>
      <p>You can now log in to your account and explore our course offerings, lessons, resources, and live classes.</p>
      <br>
      <p>Best regards,<br>The English StepUp Team</p>
    </div>
  `;

  return await resend.emails.send({
    from: process.env.EMAIL_FROM || 'English StepUp <noreply@englishstepup.com>',
    to: email,
    subject: 'Welcome to English StepUp!',
    html
  });
};

const sendResetPasswordEmail = async (email, name, otpCode) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0;">
      <h2 style="color: #FF1D25; text-align: center;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Use the verification code below to complete the reset:</p>
      <div style="background-color: #F3F4F6; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 15px; margin: 20px 0; border-radius: 4px;">
        ${otpCode}
      </div>
      <p>If you did not request a password reset, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The English StepUp Team</p>
    </div>
  `;

  return await resend.emails.send({
    from: process.env.EMAIL_FROM || 'English StepUp <noreply@englishstepup.com>',
    to: email,
    subject: 'English StepUp - Reset Password Code',
    html
  });
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail
};
