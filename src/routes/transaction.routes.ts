import express from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticateJWT, TransactionController.getTransactionRecordsByUserId);

router.get('/:id', authenticateJWT, TransactionController.getTransactionRecordById);

router.post('/', authenticateJWT, TransactionController.createTransactionRecord);

export default router;
