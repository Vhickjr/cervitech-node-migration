import { Schema, Document } from 'mongoose';
import mongoose from 'mongoose';

export interface INeckAngleRecord extends Document {
  id: number;
  appUserId: number;
  angle: number;
  craniumVertebralAngle: number;
  dateTimeRecorded: Date;
  counter: number;
} 

export const NeckAngleRecordSchema = new Schema<INeckAngleRecord>({
  id: { type: Number, required: true },
  appUserId: { type: Number, required: true },
  angle: { type: Number, required: true },
  craniumVertebralAngle: { type: Number, required: true },
  dateTimeRecorded: { type: Date, required: true },
  counter: { type: Number, required: true },
});


export const NeckAngleRecordModel = mongoose.model<INeckAngleRecord>(
  'NeckAngleRecord',
  NeckAngleRecordSchema
);