import prisma from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./email.service.js";

export const registerUser = async ({ name, email, password, role }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");

    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: { name, email, password: hashed, role: role, emailVerified: false },
    });

    console.log("Registration is successful!");
    console.log("Registered User:", { id: user.id, name: user.name, email: user.email, role: user.role })
    return user;
};


export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    // Check if user signed up with Google
    if (!user.password) {
        throw new Error("Please sign in with Google");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // generate JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRATION }
    );
    console.log("Login is successful!");
    console.log("Logged in User:", { id: user.id, name: user.name, email: user.email, role: user.role });
    return { user, token };
};



export const requestPasswordReset = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Don't reveal if email exists
        return { message: "If email exists, reset link has been sent" };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordResetToken: resetToken,
            passwordResetExpiry: resetExpiry,
        },
    });

    await sendPasswordResetEmail(email, resetToken);
    return { message: "If email exists, reset link has been sent" };
};

export const resetPassword = async (token, newPassword) => {
    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: token,
            passwordResetExpiry: { gte: new Date() },
        },
    });

    if (!user) throw new Error("Invalid or expired reset token");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashed,
            passwordResetToken: null,
            passwordResetExpiry: null,
        },
    });

    return { message: "Password reset successful" };
};
