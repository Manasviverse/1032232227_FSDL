import { Router } from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/studyRoomController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.post("/", authMiddleware, createRoom);
router.put("/:id", authMiddleware, updateRoom);
router.delete("/:id", authMiddleware, deleteRoom);

export default router;
