// src/viewmodels/auth.viewmodel.ts
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  userId: string;
}

export interface passwordResetRequest{
  email: string;
}

export interface passwordResetResponse{
  token: string;
  newPassword: string;
}