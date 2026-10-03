import {
    transporter,
    EMAIL_APP_NAME,
    EMAIL_CLIENT_URL,
    EMAIL_FROM,
} from "./transporter.js";
import {
    welcomeEmailHtml,
    welcomeEmailText,
} from "../../templates/emails/welcome.template.js";

export const sendWelcomeEmail = async ({ email, name }) => {
    const ctaUrl = `${EMAIL_CLIENT_URL}/home`;
    const year = new Date().getFullYear();
    const data = { name, appName: EMAIL_APP_NAME, ctaUrl, year };

    const info = await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: `Welcome to ${EMAIL_APP_NAME} 🎉`,
        html: welcomeEmailHtml(data),
        text: welcomeEmailText(data),
    });

    console.log("📧 Welcome email sent:", info.messageId);
    return info;
};