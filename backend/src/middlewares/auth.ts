import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/env";
import { AppError } from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
};
