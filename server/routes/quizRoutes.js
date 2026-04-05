import { Router } from "express";
import { getAllQuestions, getBySubject } from "../controllers/quizController.js";

const router = Router();
router.get("/", getAllQuestions);
router.get("/subject/:subject", getBySubject);

export default router;
