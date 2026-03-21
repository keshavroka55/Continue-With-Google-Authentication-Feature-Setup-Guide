import prisma from "../prisma.js";
import { registerUser, loginUser } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import {
    requestPasswordReset,
    resetPassword
} from "../services/authService.js";

export const register = async (req, res) => {
    try {
        console.log("Incoming body:", req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body missing" });
        }

        const { name, email, password, role } = req.body;

        if (role === 'admin') {
            return res.status(403).json({ message: "Admin registration is not allowed" });
        }

        const allowedRole = ["food_lover", "chef"].includes(role) ? role : "food_lover";

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await registerUser({ name, email, password, role: allowedRole });

        res.status(201).json({
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

        const { user, token } = await loginUser({ email, password });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: config.NODE_ENV === "production",
        });

        res.json({
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


export const getMe = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
        },
    });
    res.json(user);
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
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

        // Generate JWT token (same as regular login)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRATION }
        );

        // Set cookie (same as regular login)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: config.NODE_ENV === "production",
        });

        // Smart redirect logic based on whether user is new or existing
        let redirectUrl;

        if (user.isNewUser) {
            // NEW USER: Redirect to role selection page
            redirectUrl = `${config.CLIENT_URL}/select-role`;
        } else {
            // EXISTING USER: Redirect directly based on their stored role
            redirectUrl = user.role === 'admin' || user.role === 'chef'
                ? `${config.CLIENT_URL}/dashboard`
                : `${config.CLIENT_URL}/home`;
        }

        res.redirect(redirectUrl);
    } catch (error) {
        console.error("Google callback error:", error);
        res.redirect(`${config.CLIENT_URL}/login?error=auth_failed`);
    }
};

// New endpoint to update user role after Google login
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
