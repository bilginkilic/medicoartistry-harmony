import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import { authenticate, authorize } from '../middleware/auth';
import {
  getUserProfile,
  updateUserInfo,
  updateMedicalHistory,
  getDoctors,
  getUserHistory,
  updateUserStatus,
  getDataAccessReport
} from '../controllers/users';

const router = Router();

// Get user profile
router.get(
  '/:id',
  authenticate,
  validate([
    param('id').notEmpty().withMessage('User ID is required')
  ]),
  getUserProfile
);

// Update user information
router.put(
  '/:id',
  authenticate,
  validate([
    param('id').notEmpty().withMessage('User ID is required'),
    body('fullName').optional(),
    body('phoneNumber').optional(),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('birthDate').optional().isISO8601().withMessage('Valid date is required'),
    body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say'])
      .withMessage('Invalid gender value'),
    body('address').optional(),
    body('emergencyContact.name').optional(),
    body('emergencyContact.phone').optional(),
    body('emergencyContact.relation').optional()
  ]),
  updateUserInfo
);

// Update user medical history
router.put(
  '/:id/medical-history',
  authenticate,
  validate([
    param('id').notEmpty().withMessage('User ID is required'),
    body('allergies').optional().isArray(),
    body('medications').optional().isArray(),
    body('conditions').optional().isArray()
  ]),
  updateMedicalHistory
);

// Get list of doctors
router.get(
  '/doctors',
  authenticate,
  getDoctors
);

// Get user history timeline
router.get(
  '/:id/history',
  authenticate,
  validate([
    param('id').notEmpty().withMessage('User ID is required')
  ]),
  getUserHistory
);

// Update user status (visitor to patient)
router.put(
  '/:id/status',
  authenticate,
  authorize(['operator', 'doctor']),
  validate([
    param('id').notEmpty().withMessage('User ID is required'),
    body('role').isIn(['patient']).withMessage('Role must be patient')
  ]),
  updateUserStatus
);

// Get KVKK compliance data access report
router.get(
  '/:id/data-access-report',
  authenticate,
  validate([
    param('id').notEmpty().withMessage('User ID is required')
  ]),
  getDataAccessReport
);

export default router; 