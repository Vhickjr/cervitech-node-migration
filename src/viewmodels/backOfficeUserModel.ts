// src/viewmodels/CreateBackofficeUserDTO.ts
export interface backOfficeUserModel {
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  username: string;
  password: string;   // client provides this
  accessLevel: string;
  readOnly?: boolean;
}
