import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      statusCode: 401,
      message: 'Access token required',
      data: null
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      res.status(403).json({
        statusCode: 403,
        message: 'Invalid or expired token',
        data: null
      });
      return;
    }

    req.user = user;
    next();
  });
};

export type { AuthenticatedRequest };
