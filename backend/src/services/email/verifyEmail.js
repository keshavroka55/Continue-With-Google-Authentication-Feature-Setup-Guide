import {
    transporter,
    EMAIL_APP_NAME,
    EMAIL_CLIENT_URL,
    EMAIL_FROM,
} from "./transporter.js";
import {
    verifyEmailHtml,
    verifyEmailText,
} from "../../templates/emails/verify-email.template.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const verifyUrl = `${EMAIL_CLIENT_URL}/verify-email?token=${verificationToken}`;
    const year = new Date().getFullYear();

    const data = { verifyUrl, appName: EMAIL_APP_NAME, year };

    const info = await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: `Verify your email — ${EMAIL_APP_NAME}`,
        html: verifyEmailHtml(data),
        text: verifyEmailText(data),
    });

    console.log("📧 Verification email sent:", info.messageId);
    return info;
};