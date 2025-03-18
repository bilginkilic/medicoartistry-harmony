import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  uid: string;
  email: string;
  role: 'doctor' | 'operator' | 'patient' | 'visitor';
  fullName: string;
  phoneNumber: string;
  birthDate?: Timestamp;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalHistory?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
  };
  lastVisit?: Timestamp;
  notificationPreferences?: {
    sms: boolean;
    email: boolean;
    push: boolean;
    reminderLeadTime: number;
  };
  deviceTokens?: string[];
  dataConsentTimestamp?: Timestamp;
  dataAccessRequests?: {
    requestDate: Timestamp;
    status: 'pending' | 'completed' | 'rejected';
    completionDate?: Timestamp;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: 'patient' | 'visitor';
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface UpdateMedicalHistoryRequest {
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
} 