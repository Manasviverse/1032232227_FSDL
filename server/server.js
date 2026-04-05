import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import studyRoomRoutes from "./routes/studyRoomRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ── Core middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(logger);
app.use("/uploads", express.static("uploads")); // serve uploaded files

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "EduSync API running ✅" }));

app.use("/api/auth",         authRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/study-rooms",  studyRoomRoutes);
app.use("/api/resources",    resourceRoutes);
app.use("/api/activities",   activityRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/quiz",         quizRoutes);
app.use("/api/analytics",    analyticsRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));