// src/models/token.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const TokenSchema: Schema = new Schema<IToken>({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const EToken = mongoose.model<IToken>('Token', TokenSchema);
export default EToken;
