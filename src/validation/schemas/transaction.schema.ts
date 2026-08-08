import Joi from 'joi';
import { TRANSACTION_STATUS } from '../../enums/transaction';

export const transactionSchema = Joi.object({
  paymentRef: Joi.string().trim().required().messages({
    'string.empty': 'Payment reference is required',
    'any.required': 'Payment reference is required',
  }),

  amount: Joi.number().required().messages({
    'number.base': 'Amount must be a valid number',
    'any.required': 'Amount is required',
  }),

  status: Joi.number()
    .required()
    .valid(...Object.values(TRANSACTION_STATUS))
    .messages({
      'number.base': 'Status must be a valid number',
      'any.required': 'Status is required',
      'any.only': 'Invalid transaction status provided',
    }),

  transDate: Joi.alternatives()
    .try(Joi.date(), Joi.string())
    .required()
    .messages({
      'any.required': 'Transaction date is required',
      'alternatives.match': 'Transaction date must be a valid date',
    }),

  description: Joi.string().optional().allow(null, ''),
})
.prefs({ abortEarly: false });
