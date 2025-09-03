"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const TransactionRecord_1 = __importDefault(require("../models/TransactionRecord"));
const appUserService_service_1 = require("./appUserService.service");
const CustomException_1 = require("../helpers/CustomException");
class TransactionService {
    // Define your service methods here
    static async paymentRefAlreadyExists(paymentRef) {
        const count = await TransactionRecord_1.default.countDocuments({
            paymentRef: paymentRef.trim().toLowerCase(),
        });
        return count > 0;
    }
    static async transactionRecords(transactionVM) {
        if (await this.paymentRefAlreadyExists(transactionVM.paymentRef)) {
            throw new CustomException_1.CustomException("A payment with the same payment reference already exists.");
        }
        const existingRecord = await TransactionRecord_1.default.findOne({ appUserId: transactionVM.appUserId });
        if (existingRecord) {
            throw new CustomException_1.CustomException("A record exists with this user id.");
        }
        const transaction = new TransactionRecord_1.default({
            appUserId: transactionVM.appUserId,
            paymentRef: transactionVM.paymentRef,
            amount: transactionVM.amount,
            status: transactionVM.status,
            transDate: transactionVM.transDate,
            description: transactionVM.description,
        });
        await transaction.save();
        return appUserService_service_1.AppUserService.updateSubscriptionAsync(transactionVM.appUserId);
    }
    static async getAllTransactionRecords() {
        const transactionRecords = await TransactionRecord_1.default.find().lean();
        if (!transactionRecords) {
            throw new CustomException_1.CustomException("No transaction records found.");
        }
        return transactionRecords;
    }
    static async getTransactionRecordById(id) {
        const transactionRecord = await TransactionRecord_1.default.findById(id).lean();
        if (!transactionRecord) {
            throw new CustomException_1.CustomException("Transaction record not found.");
        }
        return transactionRecord;
    }
    static async getTransactionRecordsByUserId(appUserId) {
        const transactionRecords = await TransactionRecord_1.default.find({ appUserId }).lean();
        if (!transactionRecords) {
            throw new CustomException_1.CustomException("No transaction records found for this user.");
        }
        return transactionRecords;
    }
}
exports.TransactionService = TransactionService;
