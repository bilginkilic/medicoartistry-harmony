import { Request, Response, NextFunction } from 'express';
import * as expressValidator from 'express-validator';
import { createError, ERROR_CODES } from './errorHandler';

// Validation middleware
export const validate = (validations: expressValidator.ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    // Check for validation errors
    const errors = expressValidator.validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Create validation error response
    const extractedErrors: { [key: string]: string } = {};
    errors.array().forEach((err: any) => {
      if (err.type === 'field' && err.path) {
        extractedErrors[err.path] = err.msg;
      }
    });

    // Create and pass error to error handler
    const error = createError(
      'Validation error',
      400,
      ERROR_CODES.VALIDATION.INVALID_INPUT,
      extractedErrors
    );
    
    next(error);
  };
}; 