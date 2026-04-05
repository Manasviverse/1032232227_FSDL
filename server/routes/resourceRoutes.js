import { Router } from "express";
import {
  getAllResources,
  getResourceById,
  createResource,
  uploadResource,
  likeResource,
  deleteResource,
} from "../controllers/resourceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", getAllResources);
router.get("/:id", getResourceById);
router.post("/", authMiddleware, createResource);
// File upload route — must come BEFORE /:id to avoid route conflict
router.post("/upload", authMiddleware, upload.single("file"), uploadResource);
router.put("/:id/like", authMiddleware, likeResource);
router.delete("/:id", authMiddleware, deleteResource);

export default router;
