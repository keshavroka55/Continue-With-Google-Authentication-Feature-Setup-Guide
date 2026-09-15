import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * verifyToken
 * ──────────────────────────────────────────────────────────────
 * Reads the access token from the Authorization header.
 * Format expected: "Authorization: Bearer <accessToken>"
 *
 * The access token is SHORT-LIVED (15min) and lives in React memory —
 * never in localStorage or a cookie. This makes it invisible to XSS.
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            // Tell the client to refresh — axios interceptor handles this
            return res.status(401).json({ message: "Access token expired", code: "TOKEN_EXPIRED" });
        }
        return res.status(401).json({ message: "Invalid access token" });
    }
};