import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import passport from "./config/passport.js";
import { config } from "./config/config.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

const app = express();
// Trust proxy (required for Nginx reverse proxy)
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(cors({
    origin: config.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);

connectRabbitMQ().catch((err) => {
    console.error("RabbitMQ connection failed; welcome-email events will be disabled:", err.message);
});

export default app;
