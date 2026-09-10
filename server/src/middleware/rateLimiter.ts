import { Request, Response, NextFunction } from "express";

/**
 * middleware/rateLimiter.ts
 * ----------------
 * WHY THIS FILE EXISTS:
 * `/api/chat` har request pe OpenAI ko paisa deti hai. Agar koi bot
 * ya bad actor isko spam kare, tumhara bill barh sakta hai. Ye ek
 * simple in-memory rate limiter hai: har IP ko per-minute limited
 * number of requests deta hai.
 *
 * Production mein isko Redis-backed rate limiter se replace kar dena
 * (e.g. `rate-limiter-flexible` package) agar tum multiple server
 * instances chalate ho — in-memory Map sirf single-instance ke liye
 * reliable hai.
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // per IP per minute

const requestLog = new Map<string, number[]>();

export function chatRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "unknown";
  const now = Date.now();

  const timestamps = requestLog.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too many questions — please wait a moment before trying again.",
    });
  }

  recent.push(now);
  requestLog.set(ip, recent);
  next();
}