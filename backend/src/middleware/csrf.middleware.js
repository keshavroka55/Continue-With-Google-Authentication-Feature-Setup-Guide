import { hashToken } from "../utils/tokenUtils.js";
import { findRefreshToken } from "../services/token.service.js";

/**
 * csrfProtect
 * ──────────────────────────────────────────────────────────────
 * Protects cookie-mutating endpoints: /refresh-token, /logout
 *
 * Why only these?
 * - Regular API calls use the access token in the Authorization header.
 *   Custom headers (like Authorization: Bearer) cannot be sent by
 *   cross-site forms or img tags — so they are CSRF-safe by design.
 *
 * - /refresh-token and /logout read the HttpOnly refresh-token cookie.
 *   Cookies ARE automatically sent cross-site, so these need CSRF protection.
 *
 * Flow:
 *   1. On login, server generates a csrfToken and returns it in the JSON body.
 *   2. React stores it in memory and sends it back as "x-csrf-token" header.
 *   3. Server looks up the refresh token record in DB, checks csrfToken matches.
 */
export const csrfProtect = async (req, res, next) => {
    const csrfHeader = req.headers["x-csrf-token"];

    if (!csrfHeader) {
        return res.status(403).json({ message: "CSRF token missing" });
    }

    // The refresh token cookie (raw JWT string)
    const rawRefreshToken = req.cookies?.refreshToken;

    if (!rawRefreshToken) {
        return res.status(401).json({ message: "Refresh token cookie missing" });
    }

    try {
        const tokenHash = hashToken(rawRefreshToken);
        const record = await findRefreshToken(tokenHash);

        if (!record) {
            return res.status(401).json({ message: "Refresh token not found or expired" });
        }

        if (record.expiresAt < new Date()) {
            return res.status(401).json({ message: "Refresh token expired" });
        }

        // Constant-time comparison to prevent timing attacks
        const expected = record.csrfToken;
        const provided = csrfHeader;

        if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
            return res.status(403).json({ message: "CSRF token invalid" });
        }

        // Attach for use in the controller
        req.refreshTokenRecord = record;
        next();
    } catch (err) {
        console.error("CSRF check error:", err);
        return res.status(500).json({ message: "CSRF validation failed" });
    }
};

/**
 * Constant-time string comparison — prevents timing attacks
 * where an attacker could guess tokens byte-by-byte by measuring response time.
 */
function timingSafeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}