import { Router } from "express";
import { getAllActivities, createActivity } from "../controllers/activityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getAllActivities);
router.post("/", authMiddleware, createActivity);

export default router;
