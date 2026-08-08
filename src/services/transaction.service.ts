import mongoose from 'mongoose';
import TransactionRecord, { ITransactionRecord } from '../models/TransactionRecord';
import { TransactionViewModel } from '../types/transaction.types';
import { AppUserService } from './appUserServices/appUserService.service';
import { CustomException } from '../utils/customException';
import { TRANSACTION_STATUS } from '../enums/transaction';
import { AppUserResponse } from '../viewmodels/ResponseRateViewModel';
import { TransactionValidation } from '../validation/transactionValidation';

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
  ): Promise<AppUserResponse> {
    const validationError = TransactionValidation.transactionValidation(transactionVM);
    if (validationError) {
      throw new CustomException(validationError);
    }

    if (await this.paymentRefAlreadyExists(transactionVM.paymentRef)) {
      throw new CustomException('A payment with the same payment reference already exists.');
    }

    const existingRecord = await TransactionRecord.findOne({ appUserId });
    if (existingRecord) {
      throw new CustomException('A record exists with this user id.');
    }

    const status = this.parseTransactionStatus(transactionVM.status);

    const transaction = new TransactionRecord({
      appUserId,
      paymentRef: transactionVM.paymentRef,
      amount: transactionVM.amount,
      status,
      transDate: this.parseTransactionDate(transactionVM.transDate),
      description: transactionVM.description,
    });

    await transaction.save();

    if (status === TRANSACTION_STATUS.Completed) {
      return this.grantEntitlement(transaction);
    }

    return AppUserService.getAppUserResponse(appUserId);
  }

  // Grants hasPaid for a Completed transaction, guarding against granting
  // twice if the same record is ever re-processed (e.g. a future status
  // re-check via the Play Developer API).
  private static async grantEntitlement(transaction: ITransactionRecord): Promise<AppUserResponse> {
    if (transaction.entitlementGranted) {
      return AppUserService.getAppUserResponse(transaction.appUserId);
    }

    const response = await AppUserService.grantPaidEntitlement(transaction.appUserId);

    transaction.entitlementGranted = true;
    await transaction.save();

    return response;
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
    if (!mongoose.isValidObjectId(id)) {
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
