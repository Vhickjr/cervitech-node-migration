// src/viewmodels/auth.viewmodel.ts
export interface SignupRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  username: string;
  mobileChannel: number;
  fcmToken?: string;        
  pictureUrl?: string;
}

export interface SignupResponse {
  message: string;
  data: object;
}

export interface passwordResetRequest{
  email: string;
}

export interface passwordResetResponse{
  token: string;
  newPassword: string;
}

