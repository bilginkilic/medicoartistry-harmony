import { Timestamp } from 'firebase-admin/firestore';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: Timestamp;
  endTime: Timestamp;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  type: 'initial' | 'follow-up' | 'control' | 'procedure';
  reason: string;
  notes?: string;
  procedureRecordIds?: string[];
  previousAppointmentId?: string;
  cancellationReason?: string;
  reminderSent: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  dateTime: string;
  duration: number;
  type: 'initial' | 'follow-up' | 'control' | 'procedure';
  reason: string;
  notes?: string;
  previousAppointmentId?: string;
}

export interface UpdateAppointmentRequest {
  dateTime?: string;
  duration?: number;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  cancellationReason?: string;
}

export interface AvailableSlotsQuery {
  doctorId: string;
  date: string;
  duration?: number;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
} 