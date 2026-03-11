import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        console.log("Decoded user:", req.user);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalid" });
    }
};
