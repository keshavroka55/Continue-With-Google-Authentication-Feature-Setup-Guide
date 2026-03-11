import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: false,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
    },
});

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${config.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: "Password Reset Request - AuthApp",
        html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #FF7A00; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (email, verificationToken) => {
    const verifyUrl = `${config.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: "Verify Your Email - AuthApp",
        html: `
      <h2>Welcome to AuthApp!</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #FF7A00; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Thank you for joining AuthApp!</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};
