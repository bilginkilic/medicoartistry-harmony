import { testAuth, testFirestore } from '../config/firebase.test';
import { Request, Response } from 'express';
import { register, login, resetPassword } from '../controllers/auth';
import { RegisterRequest, LoginRequest } from '../types';
import { auth } from 'firebase-admin';

interface FirebaseAuthError {
  code: string;
  message: string;
}

function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
  return typeof error === 'object' && error !== null && 'code' in error;
}

// Helper function to create a mock request
const createMockRequest = <T>(body: T): Partial<Request> => ({
  body
});

// Helper function to create a mock response
const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Helper to create a mock next function
const mockNext = jest.fn();

// Test user data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'Password123!',
  fullName: 'Test User',
  phoneNumber: '+905551234567',
  role: 'visitor' as const
};

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  afterEach(async () => {
    try {
      // Clean up any test users
      const testEmails = [
        'test.register@medicoartistry.com',
        'test.existing@medicoartistry.com',
        'test.login@medicoartistry.com',
        'test.reset@medicoartistry.com'
      ];

      for (const email of testEmails) {
        try {
          const userRecord = await testAuth.getUserByEmail(email);
          if (userRecord) {
            await testAuth.deleteUser(userRecord.uid);
            await testFirestore.collection('users').doc(userRecord.uid).delete();
          }
        } catch (error) {
          // Ignore user-not-found errors during cleanup
          if (isFirebaseAuthError(error) && error.code !== 'auth/user-not-found') {
            console.error(`Error cleaning up test user ${email}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error during test cleanup:', error);
    }
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const testUser = {
        email: 'test.register@medicoartistry.com',
        password: 'TestPassword123!',
        fullName: 'Test Register User',
        role: 'patient',
        phoneNumber: '+12025550004'
      };

      mockReq.body = testUser;

      await register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully'
        })
      );
    });

    it('should return error when registering with existing email', async () => {
      // First, create a user
      const testUser = {
        email: 'test.existing@medicoartistry.com',
        password: 'TestPassword123!',
        fullName: 'Test Existing User',
        role: 'patient',
        phoneNumber: '+12025550005'
      };

      await testAuth.createUser({
        email: testUser.email,
        password: testUser.password,
        displayName: testUser.fullName
      });

      // Try to register with the same email
      mockReq.body = testUser;

      await register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('already exists')
        })
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // First, create a user
      const testUser = {
        email: 'test.login@medicoartistry.com',
        password: 'TestPassword123!',
        fullName: 'Test Login User',
        role: 'patient',
        phoneNumber: '+12025550006'
      };

      const userRecord = await testAuth.createUser({
        email: testUser.email,
        password: testUser.password,
        displayName: testUser.fullName
      });

      // Create user document in Firestore
      await testFirestore.collection('users').doc(userRecord.uid).set({
        email: testUser.email,
        fullName: testUser.fullName,
        role: testUser.role,
        phoneNumber: testUser.phoneNumber
      });

      // Try to login
      mockReq.body = {
        email: testUser.email,
        password: testUser.password
      };

      await login(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String)
        })
      );
    });

    it('should return error for invalid credentials', async () => {
      mockReq.body = {
        email: 'nonexistent@medicoartistry.com',
        password: 'WrongPassword123!'
      };

      await login(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Invalid credentials')
        })
      );
    });
  });

  describe('resetPassword', () => {
    it('should handle password reset request', async () => {
      // First, create a user
      const testUser = {
        email: 'test.reset@medicoartistry.com',
        password: 'TestPassword123!',
        fullName: 'Test Reset User',
        role: 'patient',
        phoneNumber: '+12025550007'
      };

      await testAuth.createUser({
        email: testUser.email,
        password: testUser.password,
        displayName: testUser.fullName
      });

      mockReq.body = {
        email: testUser.email
      };

      await resetPassword(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Password reset email sent')
        })
      );
    });
  });
}); 