import { Router } from "express";
import { chatHandler } from "../controllers/chat.controller";
import { chatRateLimiter } from "../middleware/rateLimiter";

/**
 * routes/chat.routes.ts
 * ----------------
 * Ye sirf URL ko controller se jodti hai. Isko tumhari main
 * `server/src/app.ts` (ya `index.ts`, jahan bhi baaki routes
 * register hote hain) mein import karna hai:
 *
 *   import chatRoutes from "./routes/chat.routes";
 *   app.use("/api/chat", chatRoutes);
 */

const router = Router();

router.get("/", (_req, res) => {
	res.json({
		status: "ok",
		message: "Chat API is ready. Send a POST request with a message to use it.",
	});
});

router.post("/", chatRateLimiter, chatHandler);

export default router;