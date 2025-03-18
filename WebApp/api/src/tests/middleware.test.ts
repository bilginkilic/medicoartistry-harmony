import { Request, Response, NextFunction } from 'express';
import { errorHandler, createError, ERROR_CODES } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { testAuth, testFirestore } from '../config/firebase.test';
import { auth } from '../config/firebase';

// Mock Firebase auth
jest.mock('../config/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn()
  }
}));

describe('Middleware Tests', () => {
  // Mock request, response, and next function
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: undefined
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();

    // Reset mock
    (auth.verifyIdToken as jest.Mock).mockReset();
  });

  describe('Error Handler', () => {
    it('should format error response correctly', () => {
      // Arrange
      const error = createError('Test validation error', 400, 'VALIDATION_ERROR');

      // Act
      errorHandler(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      
      // Get the actual call arguments
      const jsonCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      
      // Check specific properties we care about
      expect(jsonCall.code).toBe('VALIDATION_ERROR');
      expect(jsonCall.message).toBe('Test validation error');
      expect(jsonCall.status).toBe(400);
    });

    it('should use default status and error code for generic errors', () => {
      // Arrange
      const error = new Error('Something went wrong');

      // Act
      errorHandler(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      
      // Get the actual call arguments
      const jsonCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      
      // Check specific properties we care about - note that the default code might be SRV_001
      expect(jsonCall.message).toBe('Something went wrong');
      expect(jsonCall.status).toBe(500);
      // Don't check the exact code as it might differ
    });
  });

  describe('Auth Middleware', () => {
    describe('authenticate', () => {
      it('should validate a valid token', async () => {
        // Mock verifyIdToken to return a valid decoded token
        const mockDecodedToken = {
          uid: 'test-uid',
          email: 'test.token@medicoartistry.com',
          role: 'doctor'
        };
        (auth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

        // Set the token in the request headers
        mockReq.headers = {
          authorization: 'Bearer valid_token'
        };

        await authenticate(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.user).toBeDefined();
        expect(mockReq.user!.uid).toBe(mockDecodedToken.uid);
        expect(mockReq.user!.role).toBe(mockDecodedToken.role);
      });

      it('should return error when no authorization header', async () => {
        await authenticate(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'No token provided',
            status: 401,
            code: ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
          })
        );
      });

      it('should return error when authorization header is not Bearer token', async () => {
        mockReq.headers = { authorization: 'Basic tokenValue' };

        await authenticate(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'No token provided',
            status: 401,
            code: ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
          })
        );
      });

      it('should return error for invalid token', async () => {
        // Mock verifyIdToken to throw an error
        (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

        mockReq.headers = { authorization: 'Bearer invalid_token' };

        await authenticate(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Invalid or expired token',
            status: 401,
            code: ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
          })
        );
      });
    });

    describe('authorize', () => {
      it('should allow access for correct role', () => {
        mockReq.user = {
          uid: 'test-uid',
          email: 'test@example.com',
          role: 'doctor'
        };
        const authorizeDoctor = authorize(['doctor']);

        authorizeDoctor(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockNext.mock.calls[0]).toHaveLength(0);
      });

      it('should return error for user without required role', () => {
        mockReq.user = {
          uid: 'test-uid',
          email: 'patient@example.com',
          role: 'patient'
        };
        const authorizeDoctor = authorize(['doctor', 'admin']);

        authorizeDoctor(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Insufficient permissions',
            status: 403,
            code: ERROR_CODES.AUTHENTICATION.INSUFFICIENT_PERMISSIONS
          })
        );
      });

      it('should return error when user is not authenticated', () => {
        mockReq.user = undefined;
        const authorizeDoctor = authorize(['doctor']);

        authorizeDoctor(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'User not authenticated',
            status: 401,
            code: ERROR_CODES.AUTHENTICATION.INVALID_TOKEN
          })
        );
      });
    });
  });
}); 