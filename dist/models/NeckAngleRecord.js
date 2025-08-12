import { Schema } from 'mongoose';
export const NeckAngleRecordSchema = new Schema({
    angle: { type: Number, required: true },
    craniumVertebralAngle: { type: Number, required: true },
    dateTimeRecorded: { type: Date, required: true },
    counter: { type: Number, required: true },
});
