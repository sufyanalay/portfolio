import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getServices);
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

export default router;