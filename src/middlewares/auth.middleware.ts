// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/verifyToken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token); 
    req.userId = payload.userId;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
