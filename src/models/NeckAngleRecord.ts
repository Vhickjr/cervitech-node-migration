import { Schema, Document } from 'mongoose';

export interface INeckAngleRecord extends Document {
  angle: number;
  craniumVertebralAngle: number;
  dateTimeRecorded: Date;
  counter: number;
}

export const NeckAngleRecordSchema = new Schema<INeckAngleRecord>({
  angle: { type: Number, required: true },
  craniumVertebralAngle: { type: Number, required: true },
  dateTimeRecorded: { type: Date, required: true },
  counter: { type: Number, required: true },
});
