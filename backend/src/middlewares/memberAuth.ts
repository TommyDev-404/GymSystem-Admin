
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

declare global {
  namespace Express {
    interface Request {
      memberUser?: {
        user_id: number;
        memberId: number;
        username: string;
        role: string;
      };
    }
  }
}

export const memberAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  console.log("[MemberAuth] Incoming request", {
    method: req.method,
    path: req.originalUrl,
    hasAuthorizationHeader: Boolean(req.headers.authorization),
    authorizationType: req.headers.authorization?.split(" ")[0],
    hasCookie: Boolean(req.headers.cookie),
  });

  try {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

      if (!token) {
        console.warn("[MemberAuth] Rejected: missing token");
      
        res.status(401).json({
          message: "Authentication token is required.",
        });
        return;
      }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.user_id !== "number" ||
      typeof decoded.memberId !== "number" ||
      decoded.role !== "MEMBER" ||
      typeof decoded.username !== "string"
    ) {
      throw new AppError("Invalid member token", 401);
    }

    req.memberUser = {
      user_id: decoded.user_id,
      memberId: decoded.memberId,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid or expired token", 401));
      return;
    }

    next(error);
  }
};
