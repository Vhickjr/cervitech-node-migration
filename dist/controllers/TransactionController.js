"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const TransactionService_1 = require("../services/TransactionService");
class TransactionController {
    static async createTransactionRecord(req, res) {
        const transactionVM = req.body;
        if (!transactionVM) {
            res.status(400).json({ error: "Transaction data is required." });
            return;
        }
        try {
            const result = await TransactionService_1.TransactionService.transactionRecords(transactionVM);
            if (!result) {
                res.status(400).json({ error: "Failed to create transaction record." });
                return;
            }
            res.status(201).json(result);
        }
        catch (error) {
            console.error("Error creating transaction record:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getAllTransactionRecords(req, res) {
        try {
            const result = await TransactionService_1.TransactionService.getAllTransactionRecords();
            if (!result) {
                res.status(404).json({ error: "No transaction records found." });
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            console.error("Error fetching all transaction records:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getTransactionRecordById(req, res) {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Transaction ID is required." });
            return;
        }
        try {
            const result = await TransactionService_1.TransactionService.getTransactionRecordById(id);
            if (!result) {
                res.status(404).json({ error: "Transaction record not found." });
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            console.error("Error fetching transaction record by ID:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getTransactionRecordsByUserId(req, res) {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ error: "User ID is required." });
            return;
        }
        try {
            const result = await TransactionService_1.TransactionService.getTransactionRecordsByUserId(userId);
            if (!result) {
                res.status(404).json({ error: "No transaction records found for this user." });
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            console.error("Error fetching transaction records by user ID:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.TransactionController = TransactionController;
