import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import passport from "./config/passport.js";
import { config } from "./config/config.js";


const app = express();
// Trust proxy (required for Nginx reverse proxy)
app.set("trust proxy", 1);


app.use(express.json());

app.use(cookieParser());
// Initialize Passport
app.use(passport.initialize());

app.use(cors(
    {
        origin: config.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    }
));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});


app.use("/api/auth", authRoutes);

export default app;
