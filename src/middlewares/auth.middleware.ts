import { Request, Response, NextFunction } from "express";
import { TokenUtil } from "../utils/token.util";
import TokenBlacklist from "../models/TokenBlacklist";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; role: string };
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token expired or revoked. Please log in again.",
      });
    }

    const payload = TokenUtil.verifyToken(token);
    if (!payload) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    req.user = payload;
    next();
  } catch (err: any) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
      error: err.message,
    });
  }
};
