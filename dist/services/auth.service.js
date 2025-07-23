// MAIN BUSINESS LOGIC
// src/services/auth.service.ts
import { UserRepository } from '../infrastructure/repositories/user.repository.js';
import { HashUtil } from '../utils/hash.utils.js';
import { TokenUtil } from '../utils/token.util.js';
import generateToken from '../utils/generateToken.js';
export class AuthService {
    static async signup(data) {
        const existing = await UserRepository.findByEmail(data.email);
        if (existing)
            throw new Error('Email already in use');
        const hashedPassword = await HashUtil.hash(data.password);
        const newUser = await UserRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });
        return {
            message: 'Signup successful',
            userId: newUser._id.toString()
        };
    }
    static async requestPasswordReset({ email }) {
        const user = await UserRepository.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        const token = TokenUtil.generateResetToken(user._id.toString());
        return {
            message: 'Password link generated',
            resetLink: `http://localhost:4000/api/auth/reset-password?token=${token}`
        };
    }
    static async resetPassword({ token, newPassword }) {
        const { userId } = TokenUtil.verifyResetToken(token);
        const hashed = await HashUtil.hash(newPassword);
        ;
        await UserRepository.updatePassword(userId, hashed);
        return { messsage: 'Password reset successfully' };
    }
    static async login(data) {
        const user = await UserRepository.findByEmail(data.email);
        if (!user)
            throw new Error('User not found');
        const isValidPassword = await HashUtil.compare(data.password, user.password);
        if (!isValidPassword)
            throw new Error('Invalid password');
        const token = generateToken(user);
        return {
            id: user._id.toString(),
            username: user.name,
            email: user.email,
            token
        };
    }
}
