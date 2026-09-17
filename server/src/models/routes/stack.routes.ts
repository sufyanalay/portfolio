import express from "express";
import {
  getStacks,
  createStack,
  updateStack,
  deleteStack,
} from "../controllers/stack.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getStacks);
router.post("/", protect, createStack);
router.put("/:id", protect, updateStack);
router.delete("/:id", protect, deleteStack);

export default router;