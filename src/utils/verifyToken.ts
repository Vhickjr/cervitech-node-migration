// src/utils/verifyToken.ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as TokenPayload;
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
