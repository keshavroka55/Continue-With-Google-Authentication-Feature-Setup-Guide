import prisma from "../../prisma.js";
import { registerUser, loginUser, requestPasswordReset,resetPassword } from "./auth.service.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";


import {
    generateAccessToken,
    generateRefreshToken,
    generateCsrfToken,
    hashToken,
    refreshCookieOptions,
} from "../../utils/tokenUtils.js";
 
import {
    saveRefreshToken,
    deleteRefreshToken,
    deleteAllUserRefreshTokens,
    rotateRefreshToken,
} from "../../services/token.service.js";


const isProduction = config.NODE_ENV === "production";
 
// ─── Helper: issue all three tokens at once ───────────────────────────────────
const issueTokens = async (user, req) => {
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const csrfToken    = generateCsrfToken();
    const tokenHash    = hashToken(refreshToken);
 
    await saveRefreshToken({ // saving this info into the saveRefreshToken database table. 
        userId:    user.id,
        tokenHash,
        csrfToken,
        userAgent: req.headers["user-agent"] || null,
        ipAddress: req.ip || null,
    });
 
    return { accessToken, refreshToken, csrfToken };
};
 
// ─── Helper: set refresh token cookie ────────────────────────────────────────
const setRefreshCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, refreshCookieOptions(isProduction));
};
 
// ─── Helper: clear refresh token cookie ──────────────────────────────────────
// in the same of logout one: cleearcookies also need to match the options which is used on the setting cookies
// same path, sameSite, and secure. if not match broswer can't delete and stay here. a critical bug need to know while doing. 

const clearRefreshCookie = (res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        path: "/api/auth",
    });
};

export const register = async (req, res) => {
    try {
        // console.log("Incoming body:", req.body); testing what role is came for debugging.

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body missing" });
        }

        const { name, email, password, role } = req.body;

        if (role === 'admin') {
            return res.status(403).json({ message: "Admin registration is not allowed Muji" });
        }

        const allowedRole = ["food_lover", "chef"].includes(role) ? role : "food_lover";

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await registerUser({ name, email, password, role: allowedRole });

        res.status(201).json({
            message: "Registration successful. Please log in.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
        console.log("USER:", user);
    } catch (err) {
        console.error("Register error:", err);
        res.status(400).json({ message: err.message || "Registration failed" });
    }
};


export const login = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body missing" });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const { user } = await loginUser({ email, password });
        // Issue all three tokens
        const { accessToken, refreshToken, csrfToken } = await issueTokens(user, req);

        // Refresh token → HttpOnly cookie (path restricted to /api/auth)
        setRefreshCookie(res, refreshToken);


        // Access token + CSRF token → JSON body → React stores in memory
        res.json({
            accessToken,  // Store in React state/context — never localStorage
            csrfToken,    // Store in React state/context — send as x-csrf-token header
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(400).json({ message: err.message || "Login failed" });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/refresh-token
// Protected by: csrfProtect middleware (validates cookie + CSRF header)
// ═══════════════════════════════════════════════════════════════════════════════
export const refreshToken = async (req, res) => {
    try {
        const rawRefreshToken = req.cookies?.refreshToken;
        // req.refreshTokenRecord is attached by csrfProtect middleware

        // Verify the JWT signature + expiry
        let decoded;
        try {
            decoded = jwt.verify(rawRefreshToken, config.REFRESH_TOKEN_SECRET);
        } catch (err) {
            await deleteRefreshToken(hashToken(rawRefreshToken));
            clearRefreshCookie(res);
            return res.status(401).json({ message: "Refresh token invalid or expired" });
        }

        const user = req.refreshTokenRecord.user;

        // Rotate: generate new refresh token + new CSRF token
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        const newCsrfToken = generateCsrfToken();
        const oldHash = hashToken(rawRefreshToken);
        const newHash = hashToken(newRefreshToken);

        // Atomic swap in DB (delete old, insert new)
        await rotateRefreshToken({
            oldTokenHash: oldHash,
            userId: user.id,
            newTokenHash: newHash,
            csrfToken: newCsrfToken,
            userAgent: req.headers["user-agent"] || null,
            ipAddress: req.ip || null,
        });

        // New refresh token → replace cookie
        setRefreshCookie(res, newRefreshToken);

        // New access + CSRF tokens → JSON body
        res.json({
            accessToken: newAccessToken,
            csrfToken: newCsrfToken,
        });
    } catch (err) {
        console.error("Refresh token error:", err);
        res.status(500).json({ message: "Token refresh failed" });
    }
};


// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/me
// Returns current user from access token payload
// Protected by: verifyToken
// ═══════════════════════════════════════════════════════════════════════════════
export const getMe = async (req, res) => {
    // req.user is set by verifyToken middleware
    res.json({
        user: {
            id:    req.user.id,
            email: req.user.email,
            role:  req.user.role,
        },
    });
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// Protected by: verifyToken + csrfProtect
// ═══════════════════════════════════════════════════════════════════════════════
export const logout = async (req, res) => {
    try {
        const rawRefreshToken = req.cookies?.refreshToken;
 
        if (rawRefreshToken) {
            await deleteRefreshToken(hashToken(rawRefreshToken));
        }
 
        clearRefreshCookie(res);
 
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ message: "Logout failed" });
    }
};
 
 
// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/logout-all
// Logs out from ALL devices — deletes every refresh token for this user
// Protected by: verifyToken
// ═══════════════════════════════════════════════════════════════════════════════
export const logoutAll = async (req, res) => {
    try {
        await deleteAllUserRefreshTokens(req.user.id);
        clearRefreshCookie(res);
        res.json({ message: "Logged out from all devices" });
    } catch (err) {
        console.error("Logout all error:", err);
        res.status(500).json({ message: "Logout failed" });
    }
};

// Protected route to register admin users (only accessible by existing admins)
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Force admin role
        const user = await registerUser({
            name,
            email,
            password,
            role: "admin"
        });

        res.status(201).json({
            message: "Admin created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Admin registration error:", err);
        res.status(400).json({ message: err.message || "Admin registration failed" });
    }
};

// controller for Continue with google login.
export const googleCallback = async (req, res) => {
    try {
        const user = req.user;

        const { accessToken, refreshToken, csrfToken } = await issueTokens(user, req);
        setRefreshCookie(res, refreshToken);

        // ── Smart redirect logic ──────────────────────────────────────────────
        let redirectPath;

        if (user.isNewUser) {
            redirectPath = "/select-role";
        } else {
            redirectPath = user.role === "admin" || user.role === "chef"
                ? "/dashboard"
                : "/home";
        }

        // ── THIS IS THE PART To handle the tokes and URL. 
        const params = new URLSearchParams({
            accessToken,
            csrfToken,
            next: redirectPath    // tells React where to go after grabbing tokens and clean the URL. 
        });

        res.redirect(`${config.FRONTEND_URL}/auth/callback?${params.toString()}`);

    } catch (error) {
        console.error("Google callback error:", error);
        res.redirect(`${config.FRONTEND_URL}/login?error=oauth_failed`);
    }
};

// endpoint to update user role after Google login
export const updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.user.id;

        // Validate role
        if (!['food_lover', 'chef'].includes(role)) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        // Update user role in database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
            },
        });

        // Generate new JWT token with updated role
        const newToken = jwt.sign(
            { id: updatedUser.id, role: updatedUser.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRATION }
        );

        // Update cookie with new token
        res.cookie("token", newToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: config.NODE_ENV === "production",
        });

        res.json({
            user: updatedUser,
            message: "Role updated successfully"
        });
    } catch (error) {
        console.error("Update role error:", error);
        res.status(500).json({ message: "Failed to update role" });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        await requestPasswordReset(email); // 


        // Return success immediately
        res.json({ message: "If email exists, reset link has been sent" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const result = await resetPassword(token, password);
        res.json(result);
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(400).json({ message: error.message });
    }
};
