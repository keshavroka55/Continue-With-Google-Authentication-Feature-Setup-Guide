import nodemailer from "nodemailer";
import { config } from "../../config/config.js";

export const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: Number(config.EMAIL_PORT),
    secure: config.EMAIL_SECURE === "true",
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD
    }
});

// ── Shared constants used by all email templates ─────────────
export const EMAIL_APP_NAME = "AuthApp";
export const EMAIL_CLIENT_URL = config.CLIENT_URL || "http://localhost:3000";
export const EMAIL_FROM = config.EMAIL_FROM;