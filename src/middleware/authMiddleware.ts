import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AppError, asyncHandler } from "./errorMiddleware";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JwtPayload {
  userId: string;
}

// Protect routes - require authentication
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check for token in cookies
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError("Not authorized, no token provided", 401);
    }

    try {
      // Verify token
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // Get user from token
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new AppError("Token expired, please login again", 401);
      }
      throw new AppError("Not authorized, invalid token", 401);
    }
  }
);

// Optional auth - attach user if token exists but don't require it
export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (JWT_SECRET) {
          const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
          const user = await User.findById(decoded.userId).select("-password");
          if (user) {
            req.user = user;
          }
        }
      } catch (error) {
        // Ignore errors for optional auth
      }
    }

    next();
  }
);
