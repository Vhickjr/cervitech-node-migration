import { Schema } from 'mongoose';
import mongoose from 'mongoose';
export const NeckAngleRecordSchema = new Schema({
    id: { type: Number, required: true },
    appUserId: { type: Number, required: true },
    angle: { type: Number, required: true },
    craniumVertebralAngle: { type: Number, required: true },
    dateTimeRecorded: { type: Date, required: true },
    counter: { type: Number, required: true },
});
export const NeckAngleRecordModel = mongoose.model('NeckAngleRecord', NeckAngleRecordSchema);
