import Joi from 'joi';
import { TRANSACTION_STATUS } from '../../enums/transaction';

export const transactionSchema = Joi.object({
  paymentRef: Joi.string().trim(),

  amount: Joi.number().required().messages({
    'number.base': 'Amount must be a valid number',
    'any.required': 'Amount is required',
  }),

  status: Joi.number().valid(...Object.values(TRANSACTION_STATUS)).messages({
    'number.base': 'Status must be a valid number',
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

  // #08: a Play purchase token, verified server-side against the Android
  // Publisher API. When present, packageName/subscriptionId are required and
  // paymentRef/status are ignored from the client (see transaction.service.ts).
  purchaseToken: Joi.string().trim(),
  packageName: Joi.string().trim(),
  subscriptionId: Joi.string().trim(),
})
  .when(Joi.object({ purchaseToken: Joi.exist() }).unknown(), {
    then: Joi.object({
      purchaseToken: Joi.string().trim().required(),
      packageName: Joi.string().trim().required().messages({
        'any.required': 'packageName is required when submitting a Play purchase token',
      }),
      subscriptionId: Joi.string().trim().required().messages({
        'any.required': 'subscriptionId is required when submitting a Play purchase token',
      }),
    }),
    otherwise: Joi.object({
      paymentRef: Joi.string().trim().required().messages({
        'string.empty': 'Payment reference is required',
        'any.required': 'Payment reference is required',
      }),
      status: Joi.number()
        .required()
        .valid(...Object.values(TRANSACTION_STATUS))
        .messages({
          'number.base': 'Status must be a valid number',
          'any.required': 'Status is required',
          'any.only': 'Invalid transaction status provided',
        }),
    }),
  })
  .prefs({ abortEarly: false });
