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
