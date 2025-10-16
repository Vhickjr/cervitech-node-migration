import Joi from 'joi';
import { MOBILE_CHANNEL } from '../../enums/mobileChannel';

export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string()
    .required()
    .min(8)
    .max(30)
    .regex(/[A-Z]/, 'uppercase')
    .regex(/[a-z]/, 'lowercase')
    .regex(/[0-9]/, 'number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'special-character')
    .messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required',
      'string.min': 'Password must have a minimum of 8 characters',
      'string.max': 'Password must have a maximum of 30 characters',
      'string.regex.uppercase': 'Password must include at least one uppercase letter',
      'string.regex.lowercase': 'Password must include at least one lowercase letter',
      'string.regex.number': 'Password must include at least one number',
      'string.regex.special-character': 'Password must include at least one special character',
    }),

  firstName: Joi.string().required().messages({
    'string.empty': 'First name cannot be empty',
    'any.required': 'First name is required',
  }),

  lastName: Joi.string().required().messages({
    'string.empty': 'Last name cannot be empty',
    'any.required': 'Last name is required',
  }),

  username: Joi.string()
    .trim()
    .required()
    .min(3)
    .regex(/^[a-zA-Z0-9]+$/, 'alphanum')
    .messages({
      'string.empty': 'Username cannot be empty',
      'any.required': 'Username is required',
      'string.regex.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be a minimum of 3 characters',
    }),

  mobileChannel: Joi.number()
    .required()
    .valid(...Object.values(MOBILE_CHANNEL))
    .messages({
      'number.base': 'Mobile channel must be a valid number',
      'any.required': 'Mobile channel is required',
      'any.only': 'Invalid mobile channel provided',
    }),

  fcmToken: Joi.string().optional().allow(null, ''),

  pictureUrl: Joi.string().uri().optional().allow(null, ''),
});

export const loginSchema = Joi.object({
  emailOrUsername: Joi.string().trim().required().messages({
    'any.required': 'Email or username is required',
    'string.empty': 'Email or username cannot be empty',
  }),

  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  }),

   mobileChannel: Joi.number()
    .required()
    .valid(...Object.values(MOBILE_CHANNEL))
    .messages({
      'number.base': 'Mobile channel must be a valid number',
      'any.required': 'Mobile channel is required',
      'any.only': 'Invalid mobile channel provided',
    }),
});

export const logoutSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User id is required',
        'string.empty': 'User id cannot be empty'
    }),

    token: Joi.string().required().messages({
        'any.required': 'Token is required',
        'string.empty': 'Token cannot be empty'
    })
})


