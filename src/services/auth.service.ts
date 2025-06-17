// src/services/auth.service.ts
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { HashUtil } from '../utils/hash.utils';
import { LoginResponse } from '../dtos/auth.entity';
import { SignupRequest, SignupResponse } from '../viewmodels/auth.viewmodel';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken';


export class AuthService {
  static async signup(data: SignupRequest): Promise<SignupResponse> {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new Error('Email already in use');

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

  static async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) throw new Error('User not found');

    const isValidPassword = await HashUtil.compare(data.password, user.password);
    if (!isValidPassword) throw new Error('Invalid password');

    const token: string = generateToken(user);

    return {
      id: user._id.toString(),
      username: user.name,
      email: user.email,
      token
    };
  }
}
