import {
    transporter,
    EMAIL_APP_NAME,
    EMAIL_CLIENT_URL,
    EMAIL_FROM,
} from "./transporter.js";
import {
    resetPasswordEmailHtml,
    resetPasswordEmailText,
} from "../../templates/emails/reset-password.template.js";

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${EMAIL_CLIENT_URL}/reset-password?token=${resetToken}`;
    const year = new Date().getFullYear();

    const data = { resetUrl, appName: EMAIL_APP_NAME, year };

    const info = await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: `Password Reset Request — ${EMAIL_APP_NAME}`,
        html: resetPasswordEmailHtml(data),
        text: resetPasswordEmailText(data),
    });

    console.log("📧 Password reset email sent:", info.messageId);
    return info;
};