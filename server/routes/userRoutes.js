import { Router } from "express";
import {
    getAllUsers,
    getMe,
    getUserById,
    updateUser,
    createUser
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/me", authMiddleware, getMe);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);

// ✅ THIS FIXES YOUR ERROR
router.post("/", createUser);

export default router;