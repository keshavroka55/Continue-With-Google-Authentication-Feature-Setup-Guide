import express from "express";
import { csrfProtect } from "../../middleware/csrf.middleware.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { register, login, getMe, logout, refreshToken, logoutAll, updateRole } from "./auth.controller.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { registerAdmin } from "./auth.controller.js";
import passport from "passport";
import {googleCallback,forgotPassword,resetPasswordController} from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", csrfProtect, refreshToken);
router.post("/logout", csrfProtect, verifyToken, logout);
router.post("/logout-all", verifyToken, logoutAll);


// for auto login 
router.get("/me", verifyToken, getMe);


// 🔒 Admin-only route
router.post("/register-admin", verifyToken, allowRoles("admin"), registerAdmin);

// first time one
// router.post("/register-admin-insecure", registerAdmin);


// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login",session: false}),googleCallback);

// Role selection after Google login
router.post("/update-role", verifyToken, updateRole);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);

export default router;
