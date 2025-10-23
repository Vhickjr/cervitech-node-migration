import jwt from "jsonwebtoken";
import { IAppUser } from "../models/AppUser";
import { IBackofficeUser } from "../models/BackOfficeUser";

const APP_USER_SECRET = process.env.APP_USER_JWT_SECRET || "appuser-secret-key";
const BACKOFFICE_SECRET = process.env.BACKOFFICE_JWT_SECRET || "backoffice-secret-key";

export interface BaseTokenPayload {
  userId: string;
  role: "APP_USER" | "BACKOFFICE_USER";
  username?: string;
  email?: string;
  accessLevel?: string;
  iat?: number;
  exp?: number;
}

export class TokenUtil {
  static generateAppUserToken(user: IAppUser): string {
    const payload: BaseTokenPayload = {
      userId: String(user._id),
      role: "APP_USER",
      username: user.username,
      email: user.email,
    };
    return jwt.sign(payload, APP_USER_SECRET, { expiresIn: "2h" });
  }

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

  static verifyToken(token: string): BaseTokenPayload {
    try {
      const decoded = jwt.decode(token) as BaseTokenPayload | null;
      if (!decoded || !decoded.role) throw new Error("Invalid token structure");

      const secret = decoded.role === "BACKOFFICE_USER"
        ? BACKOFFICE_SECRET
        : APP_USER_SECRET;

      return jwt.verify(token, secret) as BaseTokenPayload;
    } catch {
      throw new Error("Invalid or expired token");
    }
  }
}
