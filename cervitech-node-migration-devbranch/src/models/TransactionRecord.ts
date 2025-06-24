import mongoose, { Schema, Document } from 'mongoose';
import { STATUS } from '../enums/status'; // Assume you have a status enum defined somewhere

export interface ITransactionRecord extends Document {
  appUserId: number;
  paymentRef: string;
  amount: mongoose.Types.Decimal128;
  status: STATUS;
  transDate: Date;
  description: string;
  createdOn: Date;
  updatedOn?: Date;
  deletedOn?: Date;
}

const TransactionRecordSchema = new Schema<ITransactionRecord>({
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

const TransactionRecord = mongoose.model<ITransactionRecord>('TransactionRecord', TransactionRecordSchema);
export default TransactionRecord;
