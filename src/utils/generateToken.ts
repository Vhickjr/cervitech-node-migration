import jwt from 'jsonwebtoken';
import { MininmalUser } from '../types/auth.types';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import * as dotenv from 'dotenv';
dotenv.config();
export class TokenService {
  static generateToken(user: MininmalUser): string  {
    const token = jwt.sign(
          { userId: user._id.toString(), email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '1h' }
        );

    return token;
  }

}
