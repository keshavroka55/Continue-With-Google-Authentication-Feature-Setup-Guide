import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config/config.js";

/**
 * Short-lived access token (configurable via config.ACCESS_TOKEN_EXPIRES_IN, default 15m)
 * Sent in JSON response body → stored in React memory (never localStorage)
 */
export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN }
    );
};

/**
 * Long-lived refresh token (configurable via config.REFRESH_TOKEN_EXPIRES_IN, default 7d)
 * Sent as HttpOnly cookie → never readable by JS
 */
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN }
    );
};

/**
 * CSRF token — random 32-byte hex string
 * Sent in JSON response body → stored in React memory
 * Must be echoed back via x-csrf-token header on sensitive requests
 */
export const generateCsrfToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash a refresh token before storing in DB
 * So even if DB is compromised, raw tokens aren't exposed
 */
export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Cookie options for the refresh token cookie
 */
export const refreshCookieOptions = (isProduction) => ({
    httpOnly: true,                          // JS cannot read this cookie
    secure: isProduction,                    // HTTPS only in production
    sameSite: isProduction ? "strict" : "lax", // strict in prod blocks CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000,       // 7 days in ms
    path: "/api/auth",                       // Cookie only sent to /api/auth routes
});