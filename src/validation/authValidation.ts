import { LoginRequest, LogoutRequest } from '../types/auth.types';
import { SignupRequest } from '../viewmodels/auth.viewmodel';
import {signupSchema, loginSchema, logoutSchema} from './schemas/auth.schema'

export class AuthValidation {
  static signupValidation(input: SignupRequest): string | null {
    const {error} = signupSchema.validate(input, {
      abortEarly: true,
      allowUnknown:false
    });

    if(error){
      return error.details[0].message.replace(/['"]+/g, '')
    }
    return null
  }

  static loginValidation(input: LoginRequest): string | null {
    const {error} = loginSchema.validate(input, {
      abortEarly: true,
      allowUnknown:false
    });

    if(error){
      return error.details[0].message.replace(/['"]+/g, '')
    }
    return null
  }

  static logoutValidation(input: LogoutRequest): string | null {
    const {error} = logoutSchema.validate(input, {
      abortEarly: true,
      allowUnknown:false
    });

    if(error){
      return error.details[0].message.replace(/['"]+/g, '')
    }
    return null
  }
}
