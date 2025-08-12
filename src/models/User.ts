import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  hash: string;
  salt: string;
  pictureUrl: string;
  dateRegistered: Date;
}

export const UserSchema: Schema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: false },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  pictureUrl: { type: String, required: false },
  dateRegistered: { type: Date, required: true, default: Date.now },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
