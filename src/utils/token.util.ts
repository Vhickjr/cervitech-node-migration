import jwt  from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET|| 'default';

export const TokenUtil = {
    generateResetToken(userId: string){
        return jwt.sign({userId}, SECRET, {expiresIn:'1h'});
    },


    verifyResetToken(token: string) {
    const SECRET = process.env.JWT_SECRET || 'default';
    try {
      return jwt.verify(token, SECRET) as { userId: string };
    } catch (err: any) {
      throw new Error(err.message || 'Invalid or expired token');
    }
  },
};