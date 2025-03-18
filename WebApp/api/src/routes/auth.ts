import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import {
  register,
  login,
  resetPassword,
  verifyEmail,
  refreshToken
} from '../controllers/auth';

const router = Router();

// Register user
router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('role').isIn(['patient', 'visitor']).withMessage('Role must be either patient or visitor')
  ]),
  register
);

// Login user
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  login
);

// Request password reset
router.post(
  '/reset-password',
  validate([
    body('email').isEmail().withMessage('Valid email is required')
  ]),
  resetPassword
);

// Verify email
router.post(
  '/verify-email',
  validate([
    body('token').notEmpty().withMessage('Token is required')
  ]),
  verifyEmail
);

// Refresh token
router.post(
  '/refresh-token',
  validate([
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ]),
  refreshToken
);

export default router; 