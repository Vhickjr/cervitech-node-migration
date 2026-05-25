import mongoose from 'mongoose';
import TransactionRecord from '../models/TransactionRecord';
import { TransactionViewModel, AppUserViewModel } from '../types/transaction.types';
import { AppUserService } from './appUserServices/appUserService.service';
import { CustomException } from '../utils/customException';
import { TRANSACTION_STATUS } from '../enums/transaction';

export class TransactionService {
  // Define your service methods here
  private static parseTransactionDate(value: unknown): Date {
    if (value instanceof Date) {
      if (!Number.isNaN(value.getTime())) return value;
      throw new CustomException('Invalid transaction date.');
    }

    if (typeof value === 'string') {
      const parsed = this.tryParseDateString(value);
      if (parsed) return parsed;
      throw new CustomException('Invalid transaction date.');
    }

    throw new CustomException('Invalid transaction date.');
  }

  private static tryParseDateString(value: string): Date | null {
    const isoDate = new Date(value);
    if (!Number.isNaN(isoDate.getTime())) return isoDate;

    const parts = value.split(/[\/\-.]/).map((part) => part.trim());
    if (parts.length !== 3) return null;

    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);

    if ([day, month, year].some((part) => Number.isNaN(part))) return null;

    const candidate = new Date(year, month, day);
    if (
      candidate.getFullYear() === year &&
      candidate.getMonth() === month &&
      candidate.getDate() === day
    ) {
      return candidate;
    }

    return null;
  }

  private static parseTransactionStatus(value: unknown): number {
    const status = typeof value === 'string' ? Number(value) : Number(value);
    const allowedStatuses = Object.values(TRANSACTION_STATUS) as number[];
    if (!Number.isInteger(status) || !allowedStatuses.includes(status)) {
      throw new CustomException('Invalid transaction status.');
    }
    return status;
  }

  static async paymentRefAlreadyExists(paymentRef: string): Promise<boolean> {
    const count = await TransactionRecord.countDocuments({
      paymentRef: paymentRef.trim().toLowerCase(),
    });
    return count > 0;
  }

  static async transactionRecords(
    appUserId: string,
    transactionVM: TransactionViewModel
  ): Promise<AppUserViewModel> {
    if (await this.paymentRefAlreadyExists(transactionVM.paymentRef)) {
      throw new CustomException('A payment with the same payment reference already exists.');
    }

    const existingRecord = await TransactionRecord.findOne({ appUserId });
    if (existingRecord) {
      throw new CustomException('A record exists with this user id.');
    }

    const transaction = new TransactionRecord({
      appUserId,
      paymentRef: transactionVM.paymentRef,
      amount: transactionVM.amount,
      status: this.parseTransactionStatus(transactionVM.status),
      transDate: this.parseTransactionDate(transactionVM.transDate),
      description: transactionVM.description,
    });

    console.log('Saving transaction:', transaction);
    await transaction.save();

    return AppUserService.updateSubscriptionAsync(appUserId);
  }

  static async getAllTransactionRecords(): Promise<TransactionViewModel[]> {
    const transactionRecords = await TransactionRecord.find().lean();
    if (!transactionRecords) {
      throw new CustomException('No transaction records found.');
    }
    return transactionRecords;
  }

  static async getTransactionRecordById(
    appUserId: string,
    id: string
  ): Promise<TransactionViewModel | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomException('Invalid transaction ID.');
    }

    const transactionRecord = await TransactionRecord.findOne({ _id: id, appUserId }).lean();
    if (!transactionRecord) {
      throw new CustomException('Transaction record not found.');
    }
    return transactionRecord;
  }

  static async getTransactionRecordsByUserId(appUserId: string): Promise<TransactionViewModel[]> {
    const transactionRecords = await TransactionRecord.find({ appUserId }).lean();
    if (!transactionRecords) {
      throw new CustomException('No transaction records found for this user.');
    }
    return transactionRecords;
  }
}
