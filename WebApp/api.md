#location
/api folder create all files for apis

# MedicoArtistry Harmony API Documentation

## API Methods Index

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/verify-email` - Verify user email
- `POST /api/auth/refresh-token` - Refresh authentication token

### User Management Endpoints
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user information
- `PUT /api/users/:id/medical-history` - Update user medical history
- `GET /api/doctors` - Get list of available doctors
- `GET /api/users/:id/history` - Get patient history timeline
- `PUT /api/users/:id/status` - Update user status (visitor to patient)
- `GET /api/users/:id/data-access-report` - Get KVKK compliance data access report

### Appointment Endpoints
- `GET /api/appointments` - Get appointments list
- `GET /api/appointments/:id` - Get detailed appointment info
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment details
- `DELETE /api/appointments/:id` - Cancel an appointment
- `GET /api/appointments/available-slots` - Get available appointment slots
- `GET /api/appointments/upcoming-controls` - Get upcoming control appointments
- `GET /api/appointments/recommended-control-dates` - Get recommended date ranges for control visits

### Procedure Categories Endpoints
- `GET /api/procedure-categories` - Get all procedure categories
- `GET /api/procedure-categories/:id` - Get specific category with procedure types
- `POST /api/procedure-categories` - Create procedure category
- `PUT /api/procedure-categories/:id` - Update procedure category

### ProcedureTypes Endpoints
- `GET /api/procedure-types` - Get list of procedure types
- `GET /api/procedure-types/:id` - Get specific procedure type details
- `POST /api/procedure-types` - Create procedure type
- `PUT /api/procedure-types/:id` - Update procedure type
- `GET /api/procedure-types/:id/routine` - Get detailed follow-up routine for specific procedure

### ProcedureRecords Endpoints
- `GET /api/procedure-records` - Get procedure records
- `GET /api/procedure-records/:id` - Get detailed procedure record
- `POST /api/procedure-records` - Create procedure record
- `PUT /api/procedure-records/:id` - Update procedure record
- `GET /api/procedure-records/patient/:patientId` - Get patient's procedure records
- `GET /api/procedure-records/follow-ups` - Get procedures requiring follow-up
- `POST /api/procedure-records/:id/patient-feedback` - Submit patient feedback
- `GET /api/procedure-records/statistics` - Get procedure statistics
- `POST /api/procedure-records/:id/photos` - Add photos to procedure record

### Patient History Endpoints
- `GET /api/patient-history/:patientId` - Get complete patient history
- `GET /api/patient-history/:patientId/timeline` - Get patient timeline
- `GET /api/patient-history/:patientId/procedures` - Get summary of patient procedures
- `POST /api/patient-history/:patientId/notes` - Add note to patient history
- `GET /api/patient-history/:patientId/treatment-progress` - Get visual treatment progress

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications/test` - Send test notification
- `POST /api/notifications/sms` - Send SMS notification
- `POST /api/notifications/email` - Send email notification
- `GET /api/notifications/settings` - Get notification preferences
- `PUT /api/notifications/settings` - Update notification preferences

### File Upload Endpoints
- `POST /api/uploads/procedure-image` - Upload procedure image
- `POST /api/uploads/patient-document` - Upload patient document
- `POST /api/uploads/profile-photo` - Upload user profile photo

### Mobile-Specific Endpoints
- `GET /api/mobile/config` - Get mobile app configuration
- `POST /api/mobile/register-device` - Register device for push notifications
- `GET /api/mobile/procedure-library` - Get optimized procedure library for mobile

## Technical Stack
- **Runtime Environment**: Node.js
- **Frontend Framework**: React with TypeScript and Vite
- **Styling**: TailwindCSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Cloud Storage
- **Cloud Functions**: Firebase Cloud Functions
- **Notifications**: Firebase Cloud Messaging (FCM), SMS API, Email Service
- **Compliance**: KVKK (Turkish Data Protection) compliant data handling

## Project Architecture

### Core Components
1. **Authentication Service**
   - User registration and login
   - Role-based access control (RBAC)
   - Token management
   - Password reset functionality

2. **Database Schema**
   ```typescript
   // Users Collection
   interface User {
     uid: string;
     email: string;
     role: 'doctor' | 'operator' | 'patient' | 'visitor';
     fullName: string;
     phoneNumber: string;
     birthDate?: Timestamp;          // Doğum tarihi
     gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
     address?: string;               // Adres bilgisi
     emergencyContact?: {            // Acil durum iletişim bilgisi
       name: string;
       phone: string;
       relation: string;
     };
     medicalHistory?: {              // Tıbbi geçmiş
       allergies: string[];
       medications: string[];
       conditions: string[];
     };
     lastVisit?: Timestamp;          // Son ziyaret tarihi
     notificationPreferences?: {     // Bildirim tercihleri
       sms: boolean;
       email: boolean;
       push: boolean;
       reminderLeadTime: number;     // Hatırlatma öncesi süre (saat)
     };
     deviceTokens?: string[];        // Mobil cihaz token'ları
     dataConsentTimestamp?: Timestamp; // KVKK onay tarihi
     dataAccessRequests?: {          // Veri erişim talepleri
       requestDate: Timestamp;
       status: 'pending' | 'completed' | 'rejected';
       completionDate?: Timestamp;
     }[];
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }

   // ProcedureCategories Collection (İşlem Kategorileri)
   interface ProcedureCategory {
     id: string;
     name: string;                   // Kategori adı
     description: string;            // Kategori açıklaması
     imageUrl?: string;              // Kategori görseli
     priority: number;               // Sıralama önceliği
     isActive: boolean;
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }

   // ProcedureTypes Collection (İşlem Tipleri)
   interface ProcedureType {
     id: string;
     categoryId: string;             // Bağlı olduğu kategori
     name: string;                   // İşlem adı
     description: string;            // İşlem açıklaması
     detailedDescription?: string;   // Detaylı açıklama 
     duration: number;               // Tahmini işlem süresi (dakika)
     difficulty: 'basic' | 'intermediate' | 'advanced'; // Zorluk seviyesi
     pricing: {                      // Fiyatlandırma
       basePrice: number;
       currency: string;
       variableFactors?: string[];   // Fiyatı değiştiren faktörler
     };
     repeatFrequency?: number;       // Tekrar edilme sıklığı (gün)
     checkupIntervals: {             // Kontrol randevu aralıkları
       stageName: string;            // Kontrol aşaması adı (örn: "İlk kontrol", "İkinci kontrol")
       dayAfterProcedure: {          // İşlemden sonra geçen gün
         min: number;                // Minimum gün
         max: number;                // Maximum gün
         recommended: number;        // Önerilen gün
       };
       isRequired: boolean;          // Zorunlu kontrol mu?
       description?: string;         // Kontrol açıklaması
     }[];
     nextProcedureInterval?: {       // Sonraki işlem aralığı
       min: number;                  // Minimum gün
       recommended: number;          // Önerilen gün
       max: number;                  // Maximum gün
     };
     aftercare?: string[];           // İşlem sonrası bakım talimatları
     contraindications?: string[];   // Kontraendikasyonlar
     requiredMaterials?: string[];   // Gerekli malzemeler
     images?: string[];              // İşleme ait görseller
     videoUrl?: string;              // Tanıtım videosu
     notes?: string;                 // Özel notlar
     isActive: boolean;              // İşlem aktif mi?
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }

   // Appointments Collection
   interface Appointment {
     id: string;
     patientId: string;
     doctorId: string;
     dateTime: Timestamp;
     endTime: Timestamp;             // Bitiş zamanı
     duration: number;               // Dakika olarak süre
     status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
     type: 'initial' | 'follow-up' | 'control' | 'procedure';
     reason: string;
     notes?: string;
     procedureRecordIds?: string[];  // Randevuda yapılan işlemlerin ID'leri
     previousAppointmentId?: string; // Önceki randevu referansı
     cancellationReason?: string;    // İptal nedeni
     reminderSent: boolean;          // Hatırlatma gönderildi mi?
     createdBy: string;              // Randevuyu kim oluşturdu (userId)
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }

   // ProcedureRecords Collection (Yapılan İşlem Kayıtları)
   interface ProcedureRecord {
     id: string;
     appointmentId: string;
     procedureTypeId: string;         // İşlem tipi referansı
     patientId: string;
     doctorId: string;
     performedAt: Timestamp;          // İşlemin yapıldığı zaman
     status: 'scheduled' | 'in-progress' | 'completed' | 'needs-followup' | 'cancelled';
     notes?: string;                  // İşleme özel notlar
     technicalNotes?: string;         // Teknik notlar (sadece doktor/operatör görebilir)
     materialsUsed?: {                // Kullanılan malzemeler
       name: string;
       quantity: number;
       unit: string;
     }[];
     appliedRegions?: string[];       // Uygulanan bölgeler
     outcome?: {                      // İşlem sonucu
       success: 'high' | 'moderate' | 'low';
       complications: string[];
       doctorNotes: string;
     };
     patientFeedback?: {              // Hasta geri bildirimi
       satisfactionLevel: number;     // 1-5 arası memnuniyet
       comments: string;
       reportedSideEffects: string[];
       reportedAt: Timestamp;
     };
     followUps: {                     // Takip randevuları
       stage: string;                 // Aşama adı
       scheduledDate?: Timestamp;     // Planlanmış tarih
       recommendedDateRange: {        // Önerilen tarih aralığı
         earliest: Timestamp;
         latest: Timestamp;
       };
       status: 'pending' | 'scheduled' | 'completed' | 'missed';
       appointmentId?: string;        // Planlanan randevu ID'si
       notes?: string;
     }[];
     nextProcedure?: {                // Sonraki işlem bilgisi
       recommendedDate: Timestamp;    // Önerilen tarih
       procedureTypeId: string;       // Önerilen işlem tipi
       notes?: string;
     };
     photos: {                        // İşlem fotoğrafları
       url: string;
       type: 'before' | 'during' | 'after' | 'follow-up';
       takenAt: Timestamp;
       notes?: string;
     }[];
     documents?: {                    // İlgili dokümanlar
       url: string;
       name: string;
       type: string;
       uploadedAt: Timestamp;
     }[];
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }

   // PatientHistory Collection (Hasta Geçmişi)
   interface PatientHistory {
     id: string;
     patientId: string;
     timeline: {
       date: Timestamp;
       type: 'appointment' | 'procedure' | 'follow-up' | 'note';
       title: string;
       description: string;
       referenceId?: string;         // Referans ID (appointment/procedure)
       doctorId?: string;
       notes?: string;
     }[];
     procedureSummary: {             // İşlem özeti
       procedureTypeId: string;
       count: number;
       lastPerformedAt: Timestamp;
       nextScheduledAt?: Timestamp;
     }[];
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }

   // Notifications Collection
   interface Notification {
     id: string;
     userId: string;
     type: 'appointment' | 'followup' | 'system' | 'message' | 'reminder';
     title: string;
     message: string;
     action?: {                      // Bildirime tıklandığında yönlendirilecek aksiyon
       type: 'navigate' | 'link' | 'action';
       target: string;
       params?: Record<string, any>;
     };
     status: 'sent' | 'delivered' | 'read';
     scheduledFor: Timestamp;
     sentAt?: Timestamp;
     readAt?: Timestamp;
     createdAt: Timestamp;
   }
   ```

## API Endpoints

### Authentication Endpoints

```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: 'patient' | 'visitor';
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/reset-password
interface ResetPasswordRequest {
  email: string;
}

// POST /api/auth/verify-email
interface VerifyEmailRequest {
  token: string;
}

// POST /api/auth/refresh-token
interface RefreshTokenRequest {
  refreshToken: string;
}
```

### User Management Endpoints

```typescript
// GET /api/users/:id
// Returns user profile

// PUT /api/users/:id
interface UpdateUserRequest {
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

// PUT /api/users/:id/medical-history
interface UpdateMedicalHistoryRequest {
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
}

// GET /api/doctors
// Returns list of available doctors

// GET /api/users/:id/history
// Returns patient history timeline
```

### Appointment Endpoints

```typescript
// GET /api/appointments
// Query Parameters: startDate, endDate, status, patientId, doctorId

// GET /api/appointments/:id
// Returns detailed appointment info with procedure records

// POST /api/appointments
interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  dateTime: string;
  duration: number;
  type: 'initial' | 'follow-up' | 'control' | 'procedure';
  reason: string;
  notes?: string;
  previousAppointmentId?: string;
}

// PUT /api/appointments/:id
interface UpdateAppointmentRequest {
  dateTime?: string;
  duration?: number;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  cancellationReason?: string;
}

// DELETE /api/appointments/:id
// Cancel an appointment

// GET /api/appointments/available-slots
// Query Parameters: doctorId, date, duration
// Returns available appointment slots

// GET /api/appointments/upcoming-controls
// Returns all upcoming control appointments that need scheduling
```

### Procedure Categories Endpoints

```typescript
// GET /api/procedure-categories
// Returns all procedure categories

// GET /api/procedure-categories/:id
// Returns a specific category with its procedure types

// POST /api/procedure-categories
interface CreateProcedureCategoryRequest {
  name: string;
  description: string;
  imageUrl?: string;
  priority: number;
}

// PUT /api/procedure-categories/:id
interface UpdateProcedureCategoryRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  priority?: number;
  isActive?: boolean;
}
```

### ProcedureTypes Endpoints
```typescript
// GET /api/procedure-types
// Query Parameters: categoryId, isActive
// Returns list of procedure types

// GET /api/procedure-types/:id
// Returns specific procedure type details

// POST /api/procedure-types
interface CreateProcedureTypeRequest {
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

// PUT /api/procedure-types/:id
interface UpdateProcedureTypeRequest {
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
```

### ProcedureRecords Endpoints
```typescript
// GET /api/procedure-records
// Query Parameters: patientId, doctorId, appointmentId, status, procedureTypeId

// GET /api/procedure-records/:id
// Returns detailed procedure record

// POST /api/procedure-records
interface CreateProcedureRecordRequest {
  appointmentId: string;
  procedureTypeId: string;
  patientId: string;
  doctorId: string;
  performedAt?: string; // Default to current time if not provided
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

// PUT /api/procedure-records/:id
interface UpdateProcedureRecordRequest {
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
      earliest: string; // ISO date string
      latest: string;   // ISO date string
    };
    status: 'pending' | 'scheduled' | 'completed' | 'missed';
    notes?: string;
  }[];
  nextProcedure?: {
    recommendedDate: string; // ISO date string
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

// GET /api/procedure-records/patient/:patientId
// Query Parameters: procedureTypeId, status
// Returns all procedure records for a specific patient

// GET /api/procedure-records/follow-ups
// Query Parameters: status, fromDate, toDate
// Returns all procedures that need follow-up

// POST /api/procedure-records/:id/patient-feedback
interface PatientFeedbackRequest {
  satisfactionLevel: number;
  comments: string;
  reportedSideEffects: string[];
}

// GET /api/procedure-records/statistics
// Query Parameters: procedureTypeId, doctorId, dateRange
// Returns statistics about procedures
```

### Patient History Endpoints

```typescript
// GET /api/patient-history/:patientId
// Returns complete patient history

// GET /api/patient-history/:patientId/timeline
// Query Parameters: startDate, endDate, type
// Returns patient timeline

// GET /api/patient-history/:patientId/procedures
// Returns summary of all procedures done for the patient

// POST /api/patient-history/:patientId/notes
interface AddHistoryNoteRequest {
  title: string;
  description: string;
  date?: string; // ISO date string, defaults to now
}
```

### Notification Endpoints

```typescript
// GET /api/notifications
// Query Parameters: status, type
// Returns user notifications

// PUT /api/notifications/:id/read
// Mark notification as read

// POST /api/notifications/test
interface SendTestNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'followup' | 'system' | 'message' | 'reminder';
}
```

### File Upload Endpoints

```typescript
// POST /api/uploads/procedure-image
// Multipart form data with image file

// POST /api/uploads/patient-document
// Multipart form data with document file
```

## Firebase Cloud Functions

### Automated Tasks

1. **Appointment Reminders**
   ```typescript
   // Triggered daily to send notifications for upcoming appointments
   exports.sendAppointmentReminders = functions.pubsub
     .schedule('every 24 hours')
     .onRun(async context => {
       // Send reminders for appointments in the next 48 hours
     });
   ```

2. **Follow-up Management**
   ```typescript
   // Triggered after procedure completion to schedule follow-ups
   exports.manageFollowUps = functions.firestore
     .document('procedureRecords/{recordId}')
     .onUpdate(async (change, context) => {
       const before = change.before.data();
       const after = change.after.data();
       
       // If status changed to completed, schedule follow-ups
       if (before.status !== 'completed' && after.status === 'completed') {
         // Create follow-up schedule based on procedure type
       }
     });
   ```

3. **Follow-up Reminders**
   ```typescript
   // Triggered daily to check for needed follow-ups
   exports.checkFollowUpNeeds = functions.pubsub
     .schedule('every 24 hours')
     .onRun(async context => {
       // Check for approaching follow-up deadlines
       // Send reminders to patients and operators
     });
   ```

4. **Next Procedure Reminders**
   ```typescript
   // Triggered to remind patients about next procedures
   exports.nextProcedureReminders = functions.pubsub
     .schedule('every 24 hours')
     .onRun(async context => {
       // Check for approaching next procedure dates
       // Send reminders to patients
     });
   ```

5. **Appointment Status Updates**
   ```typescript
   // Triggered when appointment status changes
   exports.handleAppointmentStatusChange = functions.firestore
     .document('appointments/{appointmentId}')
     .onUpdate(async (change, context) => {
       const before = change.before.data();
       const after = change.after.data();
       
       // If status changed, update related records and send notifications
       if (before.status !== after.status) {
         // Handle status change logic
       }
     });
   ```

6. **Patient Status Transition**
   ```typescript
   // Triggered after first procedure to change visitor to patient
   exports.handleVisitorToPatientTransition = functions.firestore
     .document('procedureRecords/{recordId}')
     .onCreate(async (snap, context) => {
       // Check if user is visitor and change to patient status if needed
     });
   ```

7. **Patient History Updates**
   ```typescript
   // Triggered to update patient history timeline
   exports.updatePatientHistory = functions.firestore
     .document('procedureRecords/{recordId}')
     .onWrite(async (change, context) => {
       // Update patient history with new procedure information
     });
   ```

## Security Rules

### Firestore Security Rules
```typescript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User Collection Rules
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || hasRole('operator') || hasRole('doctor'));
      allow write: if request.auth != null && 
        (request.auth.uid == userId || hasRole('operator'));
    }

    // Appointment Collection Rules
    match /appointments/{appointmentId} {
      allow read: if request.auth != null && 
        (isUserInvolved(appointmentId) || hasRole('operator') || hasRole('doctor'));
      allow create: if request.auth != null && 
        (hasRole('operator') || hasRole('doctor') || 
         (resource.data.patientId == request.auth.uid && isAppointmentCreateAllowed()));
      allow update: if request.auth != null && 
        (hasRole('operator') || hasRole('doctor') || 
         (resource.data.patientId == request.auth.uid && isAppointmentUpdateAllowed()));
      allow delete: if request.auth != null && 
        (hasRole('operator') || hasRole('doctor'));
    }

    // ProcedureType Collection Rules
    match /procedureTypes/{typeId} {
      allow read: if true; // Anyone can read procedure types
      allow write: if request.auth != null && hasRole('operator');
    }

    // ProcedureRecord Collection Rules
    match /procedureRecords/{recordId} {
      allow read: if request.auth != null && 
        (isProcedurePatient(recordId) || hasRole('operator') || hasRole('doctor'));
      allow create, update: if request.auth != null && 
        (hasRole('operator') || hasRole('doctor'));
      allow delete: if request.auth != null && hasRole('operator');
    }

    // Helper Functions
    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    function isUserInvolved(appointmentId) {
      let doc = get(/databases/$(database)/documents/appointments/$(appointmentId)).data;
      return request.auth.uid == doc.patientId || request.auth.uid == doc.doctorId;
    }

    function isProcedurePatient(recordId) {
      let doc = get(/databases/$(database)/documents/procedureRecords/$(recordId)).data;
      return request.auth.uid == doc.patientId;
    }

    function isAppointmentCreateAllowed() {
      // Add logic to determine if patient can create appointments
      return true; 
    }

    function isAppointmentUpdateAllowed() {
      // Add logic to determine if patient can update appointments
      // For example, only allow status change to 'cancelled'
      return request.resource.data.status == 'cancelled';
    }
  }
}
```

## Error Handling

```typescript
// Standard Error Response Format
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  requestId?: string;
}

// Error Codes
const ERROR_CODES = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: 'AUTH_001',
    EXPIRED_TOKEN: 'AUTH_002',
    INSUFFICIENT_PERMISSIONS: 'AUTH_003',
    EMAIL_ALREADY_EXISTS: 'AUTH_004',
    INVALID_TOKEN: 'AUTH_005'
  },
  VALIDATION: {
    INVALID_INPUT: 'VAL_001',
    MISSING_FIELD: 'VAL_002',
    INVALID_FORMAT: 'VAL_003',
    INVALID_DATE: 'VAL_004'
  },
  REQUEST: {
    NOT_FOUND: 'REQ_001',
    CONFLICT: 'REQ_002',
    FORBIDDEN: 'REQ_003',
    BAD_REQUEST: 'REQ_004',
    UNAVAILABLE: 'REQ_005'
  },
  SERVER: {
    INTERNAL_ERROR: 'SRV_001',
    DATABASE_ERROR: 'SRV_002',
    TIMEOUT: 'SRV_003',
    SERVICE_UNAVAILABLE: 'SRV_004'
  }
};
```

## Procedure-Specific Routines

### Botox Treatment Routine
```typescript
// Example of a procedure-specific routine
const botoxRoutine = {
  procedureTypeId: "botox-type-1",
  name: "Standard Botox Treatment",
  checkupIntervals: [
    {
      stageName: "First Control",
      dayAfterProcedure: {
        min: 10,
        max: 14,
        recommended: 12
      },
      isRequired: true,
      description: "First checkup to verify results and make adjustments if needed"
    }
  ],
  nextProcedureInterval: {
    min: 150, // 5 months
    recommended: 180, // 6 months
    max: 210 // 7 months
  },
  reminderSchedule: [
    {
      daysBefore: 150, // Send first reminder 1 month before recommended date
      type: "initial",
      channels: ["push", "email"]
    },
    {
      daysBefore: 7,
      type: "followup",
      channels: ["push", "sms", "email"]
    },
    {
      daysBefore: 1,
      type: "urgent",
      channels: ["sms", "push"]
    }
  ],
  aftercare: [
    "Avoid touching the treated area for 24 hours",
    "Avoid strenuous exercise for 24 hours",
    "Avoid alcohol for 24 hours",
    "Do not lie down for 4 hours after treatment"
  ]
};
```

## KVKK Compliance

The API implements necessary measures to comply with KVKK (Turkish Personal Data Protection Law):

1. **Data Access Reports**
   ```typescript
   // User data access report structure
   interface DataAccessReport {
     userId: string;
     generatedAt: Timestamp;
     dataCategories: {
       category: string; // e.g., "personal", "medical", "appointments"
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
   ```

2. **Consent Management**
   ```typescript
   // Consent record structure
   interface ConsentRecord {
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
   ```

3. **Data Deletion Requests**
   ```typescript
   // Data deletion request structure
   interface DeletionRequest {
     userId: string;
     requestedAt: Timestamp;
     status: 'pending' | 'processing' | 'completed' | 'rejected';
     categories: ('all' | 'medical' | 'appointments' | 'photos')[];
     reason?: string;
     handledBy?: string;
     completedAt?: Timestamp;
     notes?: string;
   }
   ```

## Mobile Notifications

The API provides comprehensive mobile notification capabilities:

```typescript
// Device registration structure
interface DeviceRegistration {
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android';
  model: string;
  appVersion: string;
  registeredAt: Timestamp;
  lastActive: Timestamp;
  notificationSettings: {
    appointments: boolean;
    followUps: boolean;
    marketing: boolean;
    silentHours?: {
      start: string; // HH:MM
      end: string; // HH:MM
    };
  };
}

// Push notification structure
interface PushNotification {
  to: string[]; // device tokens
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  };
  data: {
    type: 'appointment' | 'followup' | 'marketing' | 'system';
    referenceId?: string;
    action?: string;
    custom?: Record<string, string>;
  };
  android: {
    priority: 'high' | 'normal';
    channelId: string;
  };
  apns: {
    headers: {
      'apns-priority': string;
    };
    payload: {
      aps: {
        sound: string;
        badge?: number;
      };
    };
  };
}
```

## Rate Limiting

```typescript
// Implementation using Firebase Functions
const rateLimit = {
  // General API rate limiting
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  // Authentication specific rate limiting (stricter)
  authentication: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // limit to 10 auth attempts per hour
  },
  // File upload rate limiting
  fileUpload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20 // limit to 20 uploads per hour
  }
};
```

## Environment Configuration

```typescript
// .env configuration
interface Environment {
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  NODE_ENV: 'development' | 'testing' | 'staging' | 'production';
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  SMS_API_KEY?: string;
  EMAIL_SERVICE_API_KEY?: string;
  STORAGE_BUCKET: string;
  ALLOWED_ORIGINS: string; // Comma-separated list of allowed origins
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  TOKEN_EXPIRY: string; // e.g., "1h", "7d"
  REFRESH_TOKEN_EXPIRY: string; // e.g., "30d"
}
```

## Deployment

### Firebase Configuration
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|png|gif|webp|svg|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs16",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint",
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

## Testing Strategy

1. **Unit Tests**
   - Controller logic
   - Service layer functions
   - Utility functions
   - Validation functions
   - Authentication logic

2. **Integration Tests**
   - API endpoints
   - Database interactions
   - Firebase function triggers
   - Authentication flows
   - Error handling

3. **E2E Tests**
   - Complete user journeys
   - Cross-service functionality
   - Mobile app interactions
   - Doctor/Operator workflows
   - Patient appointment scheduling

4. **Performance Tests**
   - API response times
   - Database query optimization
   - Cloud Function execution time
   - Concurrent user handling

5. **Security Tests**
   - Authentication bypass attempts
   - Authorization rule testing
   - Rate limiting effectiveness
   - Data access controls
   - Input validation

## Monitoring and Logging

1. **Firebase Analytics**
   - User engagement metrics
   - Error tracking
   - Performance monitoring
   - Usage patterns

2. **Custom Logging**
   - API request/response logging
   - Error logging with categorization
   - Audit logging for critical operations
   - Security event logging

3. **Performance Monitoring**
   - API endpoint response times
   - Database query performance
   - Cloud Function execution time
   - Background task completion time

4. **Error Tracking**
   - Automated error notifications
   - Error categorization and prioritization
   - Resolution tracking
   - Trend analysis

5. **Usage Analytics**
   - Appointment scheduling patterns
   - Procedure popularity
   - User engagement metrics
   - Conversion rates (visitor to patient) 