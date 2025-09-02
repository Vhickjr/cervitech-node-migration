import jwt from 'jsonwebtoken';
import { User } from '../dtos/user.entity';
import { MininmalUser } from '../dtos/auth.entity';

const generateToken = (user: MininmalUser): string =>  {
  const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

  return token;
}

export default generateToken;