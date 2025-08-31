// src/models/BackofficeUser.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBackofficeUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  username: string;
  password:string;
  hash: string;
  salt: string;
  accessLevel: string;
  readOnly: boolean;
  resetToken?: string;
  resetTokenExpires?: Date;
}

const BackofficeUserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String },
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  accessLevel: { type: String, required: true },
  readOnly: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
});

const BackofficeUser = mongoose.model<IBackofficeUser>(
  "BackofficeUser",
  BackofficeUserSchema
);

export default BackofficeUser;
