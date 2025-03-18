import { Timestamp } from 'firebase-admin/firestore';

export interface PatientHistory {
  id: string;
  patientId: string;
  timeline: {
    date: Timestamp;
    type: 'appointment' | 'procedure' | 'follow-up' | 'note';
    title: string;
    description: string;
    referenceId?: string;
    doctorId?: string;
    notes?: string;
  }[];
  procedureSummary: {
    procedureTypeId: string;
    count: number;
    lastPerformedAt: Timestamp;
    nextScheduledAt?: Timestamp;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AddHistoryNoteRequest {
  title: string;
  description: string;
  date?: string;
}

export interface TimestampedDocument {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DataAccessReport {
  userId: string;
  generatedAt: Timestamp;
  dataCategories: {
    category: string;
    fields: string[];
    lastUpdated: Timestamp;
    sharedWith?: {
      entity: string;
      purpose: string;
      date: Timestamp;
    }[];
  }[];
  dataRetentionPolicy: string;
  dataUsageDescription: string;
}

export interface ConsentRecord {
  userId: string;
  consents: {
    type: 'general' | 'marketing' | 'thirdParty';
    given: boolean;
    timestamp: Timestamp;
    ipAddress?: string;
    method: 'app' | 'web' | 'inPerson';
  }[];
  updatedAt: Timestamp;
}

export interface DeletionRequest {
  userId: string;
  requestedAt: Timestamp;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  categories: ('all' | 'medical' | 'appointments' | 'photos')[];
  reason?: string;
  handledBy?: string;
  completedAt?: Timestamp;
  notes?: string;
} 