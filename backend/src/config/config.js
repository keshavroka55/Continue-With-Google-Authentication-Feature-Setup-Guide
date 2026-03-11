import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || "30d",
    // Google OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

    // Email
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,

    // Client
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
