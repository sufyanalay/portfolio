import express from "express";
import { getJourney, updateJourney } from "../controllers/journey.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getJourney);
router.put("/", protect, updateJourney);

export default router;