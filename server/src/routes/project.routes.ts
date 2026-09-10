import express from "express";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

// Protected routes (admin only)
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;