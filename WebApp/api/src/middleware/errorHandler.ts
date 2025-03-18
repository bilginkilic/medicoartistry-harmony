import { Request, Response, NextFunction } from 'express';

// Error interface
export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
  timestamp?: number;
  requestId?: string;
}

// Error codes
export const ERROR_CODES = {
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

// Error handler middleware
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const code = err.code || ERROR_CODES.SERVER.INTERNAL_ERROR;
  const message = err.message || 'Internal server error';
  const requestId = req.headers['x-request-id'] as string;

  // Log error for debugging
  console.error(`[ERROR] ${status} ${code}: ${message}`, {
    error: err,
    requestId,
    path: req.path,
    method: req.method,
  });

  // Send error response
  res.status(status).json({
    status,
    code,
    message,
    details: err.details,
    timestamp: err.timestamp || Date.now(),
    requestId
  });
};

// Create API error function
export const createError = (
  message: string,
  status: number,
  code: string,
  details?: any
): ApiError => {
  const error: ApiError = new Error(message);
  error.status = status;
  error.code = code;
  error.details = details;
  error.timestamp = Date.now();
  return error;
}; 