import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { createError, ERROR_CODES } from './errorHandler';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: string;
      };
    }
  }
}

// Authentication middleware
export const authenticate = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = createError(
        'No token provided',
        401,
        ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
      );
      return res.status(401).json(error);
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decodedToken = await auth.verifyIdToken(token);
      
      // Get user data from Firestore (including role)
      // This will be implemented in the User model
      
      // For now, we'll just use the basic info from the token
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: decodedToken.role || 'visitor'
      };
      
      next();
    } catch (error) {
      const authError = createError(
        'Invalid or expired token',
        401,
        ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
      );
      return res.status(401).json(authError);
    }
  } catch (error) {
    const serverError = createError(
      'Internal server error',
      500,
      ERROR_CODES.SERVER.INTERNAL_ERROR
    );
    return res.status(500).json(serverError);
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        const error = createError(
          'User not authenticated',
          401,
          ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
        );
        return res.status(401).json(error);
      }
      
      if (!roles.includes(req.user.role)) {
        const error = createError(
          'Insufficient permissions',
          403,
          ERROR_CODES.AUTHENTICATION.INSUFFICIENT_PERMISSIONS
        );
        return res.status(403).json(error);
      }
      
      next();
    } catch (error) {
      const serverError = createError(
        'Internal server error',
        500,
        ERROR_CODES.SERVER.INTERNAL_ERROR
      );
      return res.status(500).json(serverError);
    }
  };
}; 