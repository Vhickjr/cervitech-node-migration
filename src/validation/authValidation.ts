import { LoginRequest, LogoutRequest } from '../types/auth.types';
import { SignupRequest } from '../viewmodels/auth.viewmodel';
import { MOBILE_CHANNEL } from '../enums/mobileChannel';

export class AuthValidation {
  static signupValidation(input: SignupRequest): string | null {
    if (!input.email) {
      return 'Email is required';
    }
    if (!input.password) {
      return 'Password is required';
    }
    if (!input.lastName) {
      return 'Last name is required';
    }
    if (!input.firstName) {
      return 'First name is  required';
    }
    if (!input.username) {
      return 'Username is  required';
    }
    if (input.mobileChannel === undefined || input.mobileChannel === null) {
      return 'Mobile channel is required';
    }

    return null;
  }

  static loginValidation(input: LoginRequest): string | null {
    if (!input.emailOrUsername) {
      return 'Email or username is required';
    }
    if (!input.password) {
      return 'Password is required';
    }
    if (input.mobileChannel === undefined || input.mobileChannel === null) {
      return 'Mobile channel is required';
    }
    if (!Object.values(MOBILE_CHANNEL).includes(input.mobileChannel)) {
      return 'Invalid mobile channel provided';
    }
    return null;
  }

  static logoutValidation(input: LogoutRequest): string | null {
    if (!input.userId) {
      return 'User id is required';
    }
    if (!input.token) {
      return 'Token is required';
    }
    return null;
  }
}
