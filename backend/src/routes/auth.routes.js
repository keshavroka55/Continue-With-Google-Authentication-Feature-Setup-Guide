import express from "express";
import { register, login, getMe, logout, updateRole } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { registerAdmin } from "../controllers/authController.js";
import { allowRoles } from "../middleware/role.middleware.js";

import passport from "passport";
import {
    googleCallback,
    forgotPassword,
    resetPasswordController
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/logout", verifyToken, logout);

// 🔒 Admin-only route
router.post("/register-admin", verifyToken, allowRoles("admin"), registerAdmin);

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: false
    }),
    googleCallback
);

// Role selection after Google login
router.post("/update-role", verifyToken, updateRole);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);

export default router;
