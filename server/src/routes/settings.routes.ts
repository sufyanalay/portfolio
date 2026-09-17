import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller";

const router = Router();

// GET settings
router.get("/", getSettings);

// UPDATE settings
router.put("/", updateSettings);

export default router;