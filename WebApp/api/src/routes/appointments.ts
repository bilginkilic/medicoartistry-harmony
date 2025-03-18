import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots,
  getUpcomingControls,
  getRecommendedControlDates
} from '../controllers/appointments';

const router = Router();

// Get appointments list
router.get(
  '/',
  authenticate,
  validate([
    query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    query('endDate').optional().isISO8601().withMessage('Valid end date is required'),
    query('status').optional().isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'])
      .withMessage('Invalid status value'),
    query('patientId').optional(),
    query('doctorId').optional()
  ]),
  getAppointments
);

// Get detailed appointment info
router.get(
  '/:id',
  authenticate,
  validate([
    param('id').notEmpty().withMessage('Appointment ID is required')
  ]),
  getAppointmentById
);

// Create new appointment
router.post(
  '/',
  authenticate,
  validate([
    body('patientId').notEmpty().withMessage('Patient ID is required'),
    body('doctorId').notEmpty().withMessage('Doctor ID is required'),
    body('dateTime').isISO8601().withMessage('Valid date and time is required'),
    body('duration').isInt({ min: 5 }).withMessage('Valid duration is required'),
    body('type').isIn(['initial', 'follow-up', 'control', 'procedure'])
      .withMessage('Invalid appointment type'),
    body('reason').notEmpty().withMessage('Reason is required'),
    body('notes').optional(),
    body('previousAppointmentId').optional()
  ]),
  createAppointment
);

// Update appointment details
router.put(
  '/:id',
  authenticate,
  validate([
    param('id').notEmpty().withMessage('Appointment ID is required'),
    body('dateTime').optional().isISO8601().withMessage('Valid date and time is required'),
    body('duration').optional().isInt({ min: 5 }).withMessage('Valid duration is required'),
    body('status').optional().isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'])
      .withMessage('Invalid status value'),
    body('notes').optional(),
    body('cancellationReason').optional()
  ]),
  updateAppointment
);

// Cancel an appointment
router.delete(
  '/:id',
  authenticate,
  validate([
    param('id').notEmpty().withMessage('Appointment ID is required'),
    body('cancellationReason').optional()
  ]),
  cancelAppointment
);

// Get available appointment slots
router.get(
  '/available-slots',
  authenticate,
  validate([
    query('doctorId').notEmpty().withMessage('Doctor ID is required'),
    query('date').isISO8601().withMessage('Valid date is required'),
    query('duration').optional().isInt({ min: 5 }).withMessage('Valid duration is required')
  ]),
  getAvailableSlots
);

// Get upcoming control appointments
router.get(
  '/upcoming-controls',
  authenticate,
  authorize(['operator', 'doctor']),
  getUpcomingControls
);

// Get recommended date ranges for control visits
router.get(
  '/recommended-control-dates',
  authenticate,
  validate([
    query('procedureId').notEmpty().withMessage('Procedure ID is required'),
    query('procedureDate').isISO8601().withMessage('Valid procedure date is required')
  ]),
  getRecommendedControlDates
);

export default router; 