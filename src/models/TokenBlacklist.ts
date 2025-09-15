
import { Schema, model } from 'mongoose';

interface ITokenBlacklist {
  token: string;
  createdAt: Date;
}

const TokenBlacklistSchema = new Schema<ITokenBlacklist>({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' } // optional: auto-remove after 1h
});

const TokenBlacklist = model<ITokenBlacklist>('TokenBlacklist', TokenBlacklistSchema);
export default TokenBlacklist;
