// src/viewmodels/auth.viewmodel.ts

import { inflateSync } from "node:zlib";

export interface BaseServiceResponse{
  success: boolean,
  message:string
}

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

//added success to the response to handle when the its successful or not
export interface SignupResponse extends BaseServiceResponse{
  data?: object;
}

export interface passwordResetRequest{
  email: string;
}

export interface passwordResetResponse extends BaseServiceResponse{
  token: string;
  newPassword: string;
}

export interface SendPasswordTokenResponse extends BaseServiceResponse{
  resetLink?:string
}


