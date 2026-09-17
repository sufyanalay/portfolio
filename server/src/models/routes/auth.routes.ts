import express from "express";
import { login, logout, me } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;