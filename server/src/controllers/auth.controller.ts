import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const options: SignOptions = { expiresIn: "7d" };

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET as string,
    options
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true });
};

export const me = (req: Request, res: Response) => {
  res.json({ success: true, data: { authenticated: true } });
};