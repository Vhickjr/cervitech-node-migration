// src/services/auth.service.ts
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { HashUtil } from '../utils/hash.utils';
import { SignupRequest, SignupResponse } from '../viewmodels/auth.viewmodel';

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
}
