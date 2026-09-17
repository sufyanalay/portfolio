import express from "express";
import upload from "../middleware/upload.middleware";
import { uploadImage } from "../controllers/upload.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadImage);

export default router;