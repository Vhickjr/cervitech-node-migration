"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TransactionController_1 = require("../controllers/TransactionController");
const router = express_1.default.Router();
router.get("/transactions", TransactionController_1.TransactionController.getAllTransactionRecords);
router.get("/transactions/:id", TransactionController_1.TransactionController.getTransactionRecordById);
router.get("/transactions/user/:userId", TransactionController_1.TransactionController.getTransactionRecordsByUserId);
router.post("/transactions/", TransactionController_1.TransactionController.createTransactionRecord);
exports.default = router;
