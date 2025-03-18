import { Timestamp } from 'firebase-admin/firestore';

export interface ProcedureCategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  priority: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProcedureType {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  detailedDescription?: string;
  duration: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  pricing: {
    basePrice: number;
    currency: string;
    variableFactors?: string[];
  };
  repeatFrequency?: number;
  checkupIntervals: {
    stageName: string;
    dayAfterProcedure: {
      min: number;
      max: number;
      recommended: number;
    };
    isRequired: boolean;
    description?: string;
  }[];
  nextProcedureInterval?: {
    min: number;
    recommended: number;
    max: number;
  };
  aftercare?: string[];
  contraindications?: string[];
  requiredMaterials?: string[];
  images?: string[];
  videoUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProcedureRecord {
  id: string;
  appointmentId: string;
  procedureTypeId: string;
  patientId: string;
  doctorId: string;
  performedAt: Timestamp;
  status: 'scheduled' | 'in-progress' | 'completed' | 'needs-followup' | 'cancelled';
  notes?: string;
  technicalNotes?: string;
  materialsUsed?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  appliedRegions?: string[];
  outcome?: {
    success: 'high' | 'moderate' | 'low';
    complications: string[];
    doctorNotes: string;
  };
  patientFeedback?: {
    satisfactionLevel: number;
    comments: string;
    reportedSideEffects: string[];
    reportedAt: Timestamp;
  };
  followUps: {
    stage: string;
    scheduledDate?: Timestamp;
    recommendedDateRange: {
      earliest: Timestamp;
      latest: Timestamp;
    };
    status: 'pending' | 'scheduled' | 'completed' | 'missed';
    appointmentId?: string;
    notes?: string;
  }[];
  nextProcedure?: {
    recommendedDate: Timestamp;
    procedureTypeId: string;
    notes?: string;
  };
  photos: {
    url: string;
    type: 'before' | 'during' | 'after' | 'follow-up';
    takenAt: Timestamp;
    notes?: string;
  }[];
  documents?: {
    url: string;
    name: string;
    type: string;
    uploadedAt: Timestamp;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateProcedureCategoryRequest {
  name: string;
  description: string;
  imageUrl?: string;
  priority: number;
}

export interface UpdateProcedureCategoryRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  priority?: number;
  isActive?: boolean;
}

export interface CreateProcedureTypeRequest {
  categoryId: string;
  name: string;
  description: string;
  detailedDescription?: string;
  duration: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  pricing: {
    basePrice: number;
    currency: string;
    variableFactors?: string[];
  };
  repeatFrequency?: number;
  checkupIntervals: {
    stageName: string;
    dayAfterProcedure: {
      min: number;
      max: number;
      recommended: number;
    };
    isRequired: boolean;
    description?: string;
  }[];
  nextProcedureInterval?: {
    min: number;
    recommended: number;
    max: number;
  };
  aftercare?: string[];
  contraindications?: string[];
  requiredMaterials?: string[];
  images?: string[];
  videoUrl?: string;
  notes?: string;
}

export interface UpdateProcedureTypeRequest {
  categoryId?: string;
  name?: string;
  description?: string;
  detailedDescription?: string;
  duration?: number;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  pricing?: {
    basePrice: number;
    currency: string;
    variableFactors?: string[];
  };
  repeatFrequency?: number;
  checkupIntervals?: {
    stageName: string;
    dayAfterProcedure: {
      min: number;
      max: number;
      recommended: number;
    };
    isRequired: boolean;
    description?: string;
  }[];
  nextProcedureInterval?: {
    min: number;
    recommended: number;
    max: number;
  };
  aftercare?: string[];
  contraindications?: string[];
  requiredMaterials?: string[];
  images?: string[];
  videoUrl?: string;
  notes?: string;
  isActive?: boolean;
}

export interface CreateProcedureRecordRequest {
  appointmentId: string;
  procedureTypeId: string;
  patientId: string;
  doctorId: string;
  performedAt?: string;
  notes?: string;
  technicalNotes?: string;
  materialsUsed?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  appliedRegions?: string[];
  photos?: {
    url: string;
    type: 'before' | 'during' | 'after';
    notes?: string;
  }[];
}

export interface UpdateProcedureRecordRequest {
  status?: 'in-progress' | 'completed' | 'needs-followup' | 'cancelled';
  notes?: string;
  technicalNotes?: string;
  materialsUsed?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  appliedRegions?: string[];
  outcome?: {
    success: 'high' | 'moderate' | 'low';
    complications: string[];
    doctorNotes: string;
  };
  followUps?: {
    stage: string;
    recommendedDateRange: {
      earliest: string;
      latest: string;
    };
    status: 'pending' | 'scheduled' | 'completed' | 'missed';
    notes?: string;
  }[];
  nextProcedure?: {
    recommendedDate: string;
    procedureTypeId: string;
    notes?: string;
  };
  photos?: {
    url: string;
    type: 'before' | 'during' | 'after' | 'follow-up';
    notes?: string;
  }[];
  documents?: {
    url: string;
    name: string;
    type: string;
  }[];
}

export interface PatientFeedbackRequest {
  satisfactionLevel: number;
  comments: string;
  reportedSideEffects: string[];
} 