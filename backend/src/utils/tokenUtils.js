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
 * Include a unique jti so repeated logins in the same second cannot generate the same token.
 */
export const generateRefreshToken = (user) => {
    const jti = crypto.randomBytes(16).toString("hex");

    return jwt.sign(
        { id: user.id, jti },
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
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
});