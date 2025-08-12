import mongoose, { Schema } from 'mongoose';
import { STATUS } from '../enums/status'; // Assume you have a status enum defined somewhere
const TransactionRecordSchema = new Schema({
    appUserId: { type: Number, required: true },
    paymentRef: { type: String, required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    status: { type: String, enum: Object.values(STATUS), required: true },
    transDate: { type: Date, required: true },
    description: { type: String },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date },
    deletedOn: { type: Date },
});
const TransactionRecord = mongoose.model('TransactionRecord', TransactionRecordSchema);
export default TransactionRecord;
