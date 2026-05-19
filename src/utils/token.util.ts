import jwt from "jsonwebtoken";
import { IAppUser } from "../models/AppUser";
import { IBackofficeUser } from "../models/BackOfficeUser";
import AppUser from "../models/AppUser"; 
import BackofficeUser from "../models/BackOfficeUser";
import dotenv from "dotenv";
dotenv.config();

// Secrets
const APP_USER_SECRET = process.env.APP_USER_JWT_SECRET || "appuser-secret-key";
const BACKOFFICE_SECRET = process.env.BACKOFFICE_JWT_SECRET || "backoffice-secret-key";
const GENERAL_TOKEN_SECRET = process.env.GENERAL_TOKEN_SECRET || "general-secret-key";

export interface BaseTokenPayload {
  userId: string;
  role?: "APP_USER" | "BACKOFFICE_USER";
  username?: string;
  email?: string;
  accessLevel?: string;
  iat?: number;
  exp?: number;
}

export class TokenUtil {
  // 🔹 App User Auth Token
  static generateAppUserToken(user: IAppUser): string {
    const payload: BaseTokenPayload = {
      userId: String(user._id),
      role: "APP_USER",
      username: user.username,
      email: user.email,
    };
    return jwt.sign(payload, APP_USER_SECRET, { expiresIn: "2h" });
  }

  // 🔹 Backoffice Auth Token
  static generateBackofficeUserToken(user: IBackofficeUser): string {
    const payload: BaseTokenPayload = {
      userId: String(user._id),
      role: "BACKOFFICE_USER",
      username: user.username,
      email: user.email,
      accessLevel: user.accessLevel,
    };
    return jwt.sign(payload, BACKOFFICE_SECRET, { expiresIn: "2h" });
  }

  // General-purpose Token (for password reset, account deletion, etc.)
  static generateToken(identifier: string, email?: string): string {
  const payload: { userId: string; email?: string } = { userId: identifier };
  if (email) payload.email = email;
  return jwt.sign(payload, GENERAL_TOKEN_SECRET, { expiresIn: "30m" });
}

static verifyToken(token: string): { userId: string; email?: string } {
  try {
    return jwt.verify(token, GENERAL_TOKEN_SECRET) as { userId: string; email?: string };
  } catch {
    throw new Error("Invalid or expired general token");
  }
}

static async verifyUserToken(token: string): Promise<BaseTokenPayload> {
  try {
    const decoded = jwt.decode(token) as BaseTokenPayload | null;
    if (!decoded || !decoded.role) throw new Error("Invalid token structure");

    const secret =
      decoded.role === "BACKOFFICE_USER" ? BACKOFFICE_SECRET : APP_USER_SECRET;

    const payload = jwt.verify(token, secret) as BaseTokenPayload;

    // ✅ Check if the user is deleted
    let user;
    if (payload.role === "APP_USER") {
      user = await AppUser.findById(payload.userId);
    } else {
      user = await BackofficeUser.findById(payload.userId);
    }

    if (!user) throw new Error("User not found");
    if ((user as any).deleted) throw new Error("User account is deleted");

    return payload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
  
}
