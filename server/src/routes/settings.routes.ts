import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, updateSettings);

export default router;