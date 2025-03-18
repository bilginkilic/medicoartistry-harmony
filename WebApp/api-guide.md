# MedicoArtistry Harmony API Guide

## Table of Contents
1. [Authentication](#authentication)
   - [Register](#1-register)
   - [Login](#2-login)
   - [Reset Password](#3-reset-password)
   - [Refresh Token](#4-refresh-token)
   - [Verify Email](#5-verify-email)
2. [Users](#users)
   - [Get User Profile](#1-get-user-profile)
   - [Update User Info](#2-update-user-info)
   - [Update Medical History](#3-update-medical-history)
   - [Get Doctors](#4-get-doctors)
   - [Get User History](#5-get-user-history)
   - [Update User Status](#6-update-user-status)
   - [Get Data Access Report](#7-get-data-access-report)
3. [Appointments](#appointments)
   - [Get Appointments](#1-get-appointments)
   - [Get Appointment by ID](#2-get-appointment-by-id)
   - [Create Appointment](#3-create-appointment)
   - [Update Appointment](#4-update-appointment)
   - [Cancel Appointment](#5-cancel-appointment)
   - [Get Available Slots](#6-get-available-slots)
   - [Get Upcoming Controls](#7-get-upcoming-controls)
   - [Get Recommended Control Dates](#8-get-recommended-control-dates)

## Authentication

### 1. Register
**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user in the system.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "role": "patient" | "visitor",
  "birthDate": "string (optional)",
  "gender": "string (optional)"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "uid": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate a user and receive access tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "uid": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  },
  "token": "string",
  "refreshToken": "string"
}
```

### 3. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Description:** Request a password reset link.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

### 4. Refresh Token
**Endpoint:** `POST /api/auth/refresh-token`

**Description:** Get a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "accessToken": "string"
}
```

### 5. Verify Email
**Endpoint:** `POST /api/auth/verify-email`

**Description:** Verify user's email address.

**Request Body:**
```json
{
  "token": "string"
}
```

**Response (200):**
```json
{
  "message": "Email verification successful"
}
```

## Users

### 1. Get User Profile
**Endpoint:** `GET /api/users/:id`

**Description:** Retrieve a specific user's profile.

**Headers Required:**
- Authorization: Bearer {token}

**Response (200):**
```json
{
  "user": {
    "uid": "string",
    "email": "string",
    "fullName": "string",
    "role": "string",
    "phoneNumber": "string",
    "birthDate": "string",
    "gender": "string",
    "address": "string",
    "emergencyContact": {
      "name": "string",
      "phone": "string",
      "relation": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 2. Update User Info
**Endpoint:** `PUT /api/users/:id`

**Description:** Update a user's information.

**Headers Required:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "fullName": "string (optional)",
  "phoneNumber": "string (optional)",
  "email": "string (optional)",
  "birthDate": "string (optional, ISO8601)",
  "gender": "string (optional, enum: male, female, other, prefer_not_to_say)",
  "address": "string (optional)",
  "emergencyContact": {
    "name": "string (optional)",
    "phone": "string (optional)",
    "relation": "string (optional)"
  }
}
```

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "uid": "string",
    "email": "string",
    "fullName": "string",
    "role": "string",
    "phoneNumber": "string",
    "updatedAt": "string"
  }
}
```

### 3. Update Medical History
**Endpoint:** `PUT /api/users/:id/medical-history`

**Description:** Update a user's medical history.

**Headers Required:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "allergies": ["string (optional)"],
  "medications": ["string (optional)"],
  "conditions": ["string (optional)"]
}
```

**Response (200):**
```json
{
  "message": "Medical history updated successfully",
  "medicalHistory": {
    "allergies": ["string"],
    "medications": ["string"],
    "conditions": ["string"],
    "updatedAt": "string"
  }
}
```

### 4. Get Doctors
**Endpoint:** `GET /api/users/doctors`

**Description:** Retrieve all doctors in the system.

**Headers Required:**
- Authorization: Bearer {token}

**Response (200):**
```json
{
  "doctors": [
    {
      "uid": "string",
      "email": "string",
      "fullName": "string",
      "specialization": "string",
      "availability": {
        "monday": ["string"],
        "tuesday": ["string"],
        "wednesday": ["string"],
        "thursday": ["string"],
        "friday": ["string"]
      }
    }
  ]
}
```

### 5. Get User History
**Endpoint:** `GET /api/users/:id/history`

**Description:** Retrieve user's timeline history.

**Headers Required:**
- Authorization: Bearer {token}

**Response (200):**
```json
{
  "history": [
    {
      "id": "string",
      "type": "string",
      "description": "string",
      "date": "string",
      "details": "object"
    }
  ]
}
```

### 6. Update User Status
**Endpoint:** `PUT /api/users/:id/status`

**Description:** Update user status from visitor to patient.

**Headers Required:**
- Authorization: Bearer {token}

**Required Role:** operator, doctor

**Request Body:**
```json
{
  "role": "patient"
}
```

**Response (200):**
```json
{
  "message": "User status updated successfully",
  "user": {
    "uid": "string",
    "role": "patient",
    "updatedAt": "string"
  }
}
```

### 7. Get Data Access Report
**Endpoint:** `GET /api/users/:id/data-access-report`

**Description:** Get KVKK compliance data access report.

**Headers Required:**
- Authorization: Bearer {token}

**Response (200):**
```json
{
  "report": {
    "userId": "string",
    "accessLogs": [
      {
        "timestamp": "string",
        "accessedBy": "string",
        "action": "string",
        "dataType": "string"
      }
    ]
  }
}
```

## Appointments

### 1. Get Appointments
**Endpoint:** `GET /api/appointments`

**Description:** Retrieve appointments list with optional filters.

**Headers Required:**
- Authorization: Bearer {token}

**Query Parameters:**
- startDate (optional, ISO8601)
- endDate (optional, ISO8601)
- status (optional, enum: scheduled, confirmed, completed, cancelled, no-show)
- patientId (optional)
- doctorId (optional)

**Response (200):**
```json
{
  "appointments": [
    {
      "id": "string",
      "patientId": "string",
      "doctorId": "string",
      "dateTime": "string",
      "duration": "number",
      "type": "string",
      "status": "string",
      "reason": "string",
      "notes": "string"
    }
  ]
}
```

### 2. Get Appointment by ID
**Endpoint:** `GET /api/appointments/:id`

**Description:** Get detailed appointment information.

**Headers Required:**
- Authorization: Bearer {token}

**Response (200):**
```json
{
  "appointment": {
    "id": "string",
    "patientId": "string",
    "doctorId": "string",
    "dateTime": "string",
    "duration": "number",
    "type": "string",
    "status": "string",
    "reason": "string",
    "notes": "string",
    "previousAppointmentId": "string"
  }
}
```

### 3. Create Appointment
**Endpoint:** `POST /api/appointments`

**Description:** Create a new appointment.

**Headers Required:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "patientId": "string",
  "doctorId": "string",
  "dateTime": "string (ISO8601)",
  "duration": "number (min: 5)",
  "type": "string (enum: initial, follow-up, control, procedure)",
  "reason": "string",
  "notes": "string (optional)",
  "previousAppointmentId": "string (optional)"
}
```

**Response (201):**
```json
{
  "message": "Appointment created successfully",
  "appointment": {
    "id": "string",
    "patientId": "string",
    "doctorId": "string",
    "dateTime": "string",
    "duration": "number",
    "type": "string",
    "status": "string",
    "reason": "string"
  }
}
```

### 4. Update Appointment
**Endpoint:** `PUT /api/appointments/:id`

**Description:** Update appointment details.

**Headers Required:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "dateTime": "string (optional, ISO8601)",
  "duration": "number (optional, min: 5)",
  "status": "string (optional, enum: scheduled, confirmed, completed, cancelled, no-show)",
  "notes": "string (optional)",
  "cancellationReason": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Appointment updated successfully",
  "appointment": {
    "id": "string",
    "status": "string",
    "dateTime": "string",
    "duration": "number",
    "notes": "string"
  }
}
```

### 5. Cancel Appointment
**Endpoint:** `DELETE /api/appointments/:id`

**Description:** Cancel an existing appointment.

**Headers Required:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "cancellationReason": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Appointment cancelled successfully"
}
```

### 6. Get Available Slots
**Endpoint:** `GET /api/appointments/available-slots`

**Description:** Get available appointment slots for a doctor.

**Headers Required:**
- Authorization: Bearer {token}

**Query Parameters:**
- doctorId (required)
- date (required, ISO8601)
- duration (optional, min: 5)

**Response (200):**
```json
{
  "availableSlots": [
    {
      "startTime": "string",
      "endTime": "string",
      "duration": "number"
    }
  ]
}
```

### 7. Get Upcoming Controls
**Endpoint:** `GET /api/appointments/upcoming-controls`

**Description:** Get list of upcoming control appointments.

**Headers Required:**
- Authorization: Bearer {token}

**Required Role:** operator, doctor

**Response (200):**
```json
{
  "controls": [
    {
      "id": "string",
      "patientId": "string",
      "doctorId": "string",
      "dateTime": "string",
      "type": "control",
      "previousAppointmentId": "string"
    }
  ]
}
```

### 8. Get Recommended Control Dates
**Endpoint:** `GET /api/appointments/recommended-control-dates`

**Description:** Get recommended date ranges for control visits.

**Headers Required:**
- Authorization: Bearer {token}

**Query Parameters:**
- procedureId (required)
- procedureDate (required, ISO8601)

**Response (200):**
```json
{
  "recommendedDates": [
    {
      "controlNumber": "number",
      "earliestDate": "string",
      "latestDate": "string",
      "recommendedDate": "string"
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "error": "Validation error",
  "status": 400,
  "code": "VAL_001",
  "details": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "No token provided",
  "status": 401,
  "code": "AUTH_001"
}
```

**403 Forbidden:**
```json
{
  "error": "Insufficient permissions",
  "status": 403,
  "code": "AUTH_002"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found",
  "status": 404,
  "code": "RSC_001"
}
```

**409 Conflict:**
```json
{
  "error": "Resource already exists",
  "status": 409,
  "code": "RSC_002"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "status": 500,
  "code": "SRV_001"
}
```

## Authentication Headers

For protected endpoints, include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Notes for Frontend Developers

1. Always store the refresh token securely and use it to obtain new access tokens when they expire.
2. Handle 401 errors by attempting to refresh the access token and retrying the failed request.
3. Implement proper error handling for all API calls.
4. Use appropriate loading states while waiting for API responses.
5. Validate input data on the frontend before making API calls.
6. Consider implementing request interceptors to automatically handle token management.
7. For date/time fields, always use ISO8601 format.
8. Handle pagination for endpoints that return lists of items.
9. Implement proper error messages and user feedback for all API interactions.
10. Use TypeScript interfaces to ensure type safety when working with API responses. 