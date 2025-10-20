import express from "express";
import { TransactionController } from "../controllers/transaction.controller";


const router = express.Router();


router.get("/", TransactionController.getAllTransactionRecords);

router.get("/:id", TransactionController.getTransactionRecordById);

router.get("/user/:userId", TransactionController.getTransactionRecordsByUserId);

router.post("/", TransactionController.createTransactionRecord);

export default router;