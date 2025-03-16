# MedicoArtistry Harmony API Documentation

## Technical Stack
- **Runtime Environment**: Node.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Cloud Storage
- **Cloud Functions**: Firebase Cloud Functions
- **Notifications**: Firebase Cloud Messaging (FCM)

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
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }

   // Appointments Collection
   interface Appointment {
     id: string;
     patientId: string;
     doctorId: string;
     dateTime: Timestamp;
     status: 'scheduled' | 'completed' | 'cancelled';
     reason: string;
     notes?: string;
     procedureType?: string;
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }

   // Procedures Collection
   interface Procedure {
     id: string;
     appointmentId: string;
     patientId: string;
     doctorId: string;
     type: string;
     details: string;
     followUpRequired: boolean;
     followUpInterval: number; // in days
     createdAt: Timestamp;
   }

   // Notifications Collection
   interface Notification {
     id: string;
     userId: string;
     type: 'appointment' | 'followup' | 'system';
     message: string;
     status: 'sent' | 'read';
     scheduledFor: Timestamp;
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
```

### Appointment Endpoints

```typescript
// GET /api/appointments
// Query Parameters: startDate, endDate, status

// POST /api/appointments
interface CreateAppointmentRequest {
  doctorId: string;
  dateTime: string;
  reason: string;
  notes?: string;
}

// PUT /api/appointments/:id
interface UpdateAppointmentRequest {
  dateTime?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// DELETE /api/appointments/:id
```

### Procedure Endpoints

```typescript
// GET /api/procedures
// Query Parameters: patientId, doctorId, type

// POST /api/procedures
interface CreateProcedureRequest {
  appointmentId: string;
  type: string;
  details: string;
  followUpRequired: boolean;
  followUpInterval?: number;
}

// PUT /api/procedures/:id
interface UpdateProcedureRequest {
  details?: string;
  followUpRequired?: boolean;
  followUpInterval?: number;
}
```

### User Management Endpoints

```typescript
// GET /api/users/:id

// PUT /api/users/:id
interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

// GET /api/doctors
// Returns list of available doctors
```

## Firebase Cloud Functions

### Automated Tasks
1. **Appointment Reminders**
   ```typescript
   // Triggered daily to send notifications
   exports.sendAppointmentReminders = functions.pubsub
     .schedule('every 24 hours')
     .onRun(async context => {
       // Send reminders for upcoming appointments
     });
   ```

2. **Follow-up Scheduler**
   ```typescript
   // Triggered after procedure completion
   exports.scheduleFollowUp = functions.firestore
     .document('procedures/{procedureId}')
     .onCreate(async (snap, context) => {
       // Schedule follow-up based on procedure type
     });
   ```

3. **Status Updates**
   ```typescript
   // Triggered when appointment status changes
   exports.handleStatusChange = functions.firestore
     .document('appointments/{appointmentId}')
     .onUpdate(async (change, context) => {
       // Handle status changes and notifications
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
        (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null && 
        (request.auth.uid == userId || isAdmin());
    }

    // Appointment Collection Rules
    match /appointments/{appointmentId} {
      allow read: if request.auth != null && 
        (isUserInvolved() || isAdmin());
      allow write: if request.auth != null && 
        (isOperator() || isDoctor());
    }

    // Helper Functions
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'operator';
    }

    function isDoctor() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor';
    }

    function isOperator() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'operator';
    }

    function isUserInvolved() {
      let doc = get(/databases/$(database)/documents/appointments/$(appointmentId)).data;
      return request.auth.uid == doc.patientId || request.auth.uid == doc.doctorId;
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
}

// Error Codes
const ERROR_CODES = {
  UNAUTHORIZED: 'AUTH_001',
  INVALID_INPUT: 'VAL_001',
  NOT_FOUND: 'REQ_001',
  CONFLICT: 'REQ_002',
  SERVER_ERROR: 'SRV_001'
};
```

## Rate Limiting

```typescript
// Implementation using Firebase Functions
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
```

## Environment Configuration

```typescript
// .env configuration
interface Environment {
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  NODE_ENV: 'development' | 'production';
  SMS_API_KEY?: string;
  EMAIL_SERVICE_API_KEY?: string;
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
        "source": "**",
        "function": "api"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs16"
  }
}
```

## Testing Strategy

1. **Unit Tests**
   - Controller logic
   - Service layer functions
   - Utility functions

2. **Integration Tests**
   - API endpoints
   - Firebase function triggers
   - Authentication flows

3. **E2E Tests**
   - Complete user journeys
   - Cross-service functionality

## Monitoring and Logging

1. **Firebase Analytics**
   - User engagement metrics
   - Error tracking
   - Performance monitoring

2. **Custom Logging**
   - API request/response logging
   - Error logging
   - Audit logging for critical operations 