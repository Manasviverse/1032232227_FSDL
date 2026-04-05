import { Router } from "express";
import {
  getWeeklyStats,
  getStudyHoursData,
  getQuizPerformance,
  getContributions,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
router.get("/weekly-stats", authMiddleware, getWeeklyStats);
router.get("/study-hours", getStudyHoursData);
router.get("/quiz-performance", getQuizPerformance);
router.get("/contributions", getContributions);

export default router;
