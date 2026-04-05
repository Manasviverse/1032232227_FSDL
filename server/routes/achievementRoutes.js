import { Router } from "express";
import { getAllAchievements, getMyAchievements } from "../controllers/achievementController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getAllAchievements);
router.get("/me", authMiddleware, getMyAchievements);

export default router;
