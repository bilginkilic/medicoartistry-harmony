// Create mock Firestore
const mockFirestore = {
  collection: jest.fn(),
};

// Mock the firebase config module
jest.mock('../config/firebase', () => ({
  firestore: mockFirestore
}));

import { Request, Response, NextFunction } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDoctors,
  getDocumentsByUser
} from '../controllers/users';

// Define user role type
type UserRole = 'admin' | 'doctor' | 'patient';

// Define interfaces for request parameters
interface GetUserByIdParams {
  id: string;
}

interface UpdateUserParams {
  id: string;
}

interface DeleteUserParams {
  id: string;
}

interface GetDocumentsByUserParams {
  userId: string;
}

interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: UserRole;
}

// Define interface for mock request user
interface MockRequestUser {
  uid: string;
  email: string;
  role: UserRole;
}

// Test user data
const testUsers = [
  { uid: 'user1', email: 'user1@example.com', fullName: 'User One', role: 'patient' as UserRole },
  { uid: 'user2', email: 'user2@example.com', fullName: 'User Two', role: 'doctor' as UserRole },
  { uid: 'user3', email: 'user3@example.com', fullName: 'User Three', role: 'admin' as UserRole }
];

const testDocuments = [
  { id: 'doc1', userId: 'user1', title: 'Document 1' },
  { id: 'doc2', userId: 'user1', title: 'Document 2' }
];

// Helper function to create mock request
const createMockRequest = <T = any>(params = {}, user?: MockRequestUser) => {
  const req: Partial<Request<T>> = {
    params: params as T,
    body: {},
    user: user,
  };
  return req as Request<T>;
};

// Helper function to create mock response
const createMockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return res as Response;
};

// Mock next function
const mockNext: NextFunction = jest.fn();

describe('User Controller', () => {
  let mockCollectionFn: jest.Mock;
  let mockDocFn: jest.Mock;
  let mockWhereFn: jest.Mock;
  let mockGetFn: jest.Mock;
  let mockSetFn: jest.Mock;
  let mockUpdateFn: jest.Mock;
  let mockDeleteFn: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up Firestore mocks
    mockGetFn = jest.fn();
    mockSetFn = jest.fn();
    mockUpdateFn = jest.fn();
    mockDeleteFn = jest.fn();
    mockWhereFn = jest.fn();
    mockDocFn = jest.fn().mockReturnValue({
      get: mockGetFn,
      set: mockSetFn,
      update: mockUpdateFn,
      delete: mockDeleteFn
    });
    mockCollectionFn = jest.fn().mockReturnValue({
      doc: mockDocFn,
      where: mockWhereFn,
      get: mockGetFn
    });
    mockFirestore.collection.mockImplementation((collectionName: string) => {
      mockCollectionFn(collectionName);
      return {
        doc: mockDocFn,
        where: mockWhereFn,
        get: mockGetFn
      };
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      // Mock Firestore response
      const mockSnapshot = {
        docs: testUsers.map(user => ({
          id: user.uid,
          data: () => user
        }))
      };
      mockGetFn.mockResolvedValueOnce(mockSnapshot);

      const req = createMockRequest();
      const res = createMockResponse();

      await getUsers(req, res, mockNext);

      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockGetFn).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        users: testUsers
      });
    });

    it('should handle errors', async () => {
      mockGetFn.mockRejectedValueOnce(new Error('Database error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await getUsers(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch users'
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const testUser = testUsers[0];
      const mockSnapshot = {
        exists: true,
        id: testUser.uid,
        data: () => testUser
      };
      mockGetFn.mockResolvedValueOnce(mockSnapshot);

      const req = createMockRequest<GetUserByIdParams>({ id: testUser.uid });
      const res = createMockResponse();

      await getUserById(req, res, mockNext);

      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockDocFn).toHaveBeenCalledWith(testUser.uid);
      expect(mockGetFn).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        user: testUser
      });
    });

    it('should return 404 if user not found', async () => {
      const mockSnapshot = {
        exists: false
      };
      mockGetFn.mockResolvedValueOnce(mockSnapshot);

      const req = createMockRequest<GetUserByIdParams>({ id: 'nonexistent' });
      const res = createMockResponse();

      await getUserById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });

    it('should handle errors', async () => {
      mockGetFn.mockRejectedValueOnce(new Error('Database error'));

      const req = createMockRequest<GetUserByIdParams>({ id: 'user1' });
      const res = createMockResponse();

      await getUserById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch user'
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const testUser = testUsers[0];
      const updateData = { fullName: 'Updated Name' };
      const mockSnapshot = {
        exists: true,
        id: testUser.uid,
        data: () => testUser
      };
      mockGetFn.mockResolvedValueOnce(mockSnapshot);
      mockUpdateFn.mockResolvedValueOnce({});

      const req = createMockRequest<UpdateUserParams>({ id: testUser.uid }, { uid: testUser.uid, email: testUser.email, role: testUser.role });
      req.body = updateData;
      const res = createMockResponse();

      await updateUser(req, res, mockNext);

      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockDocFn).toHaveBeenCalledWith(testUser.uid);
      expect(mockUpdateFn).toHaveBeenCalledWith(expect.objectContaining({
        fullName: updateData.fullName,
        updatedAt: expect.any(Date)
      }));
      expect(res.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: expect.objectContaining({
          ...testUser,
          ...updateData
        })
      });
    });

    it('should return 404 if user not found', async () => {
      const mockSnapshot = {
        exists: false
      };
      mockGetFn.mockResolvedValueOnce(mockSnapshot);

      const req = createMockRequest<UpdateUserParams>({ id: 'nonexistent' });
      req.body = { fullName: 'Updated Name' };
      const res = createMockResponse();

      await updateUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });

    it('should handle errors', async () => {
      mockGetFn.mockRejectedValueOnce(new Error('Database error'));

      const req = createMockRequest<UpdateUserParams>({ id: 'user1' });
      req.body = { fullName: 'Updated Name' };
      const res = createMockResponse();

      await updateUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to update user'
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const testUser = testUsers[0];
      const mockSnapshot = {
        exists: true,
        id: testUser.uid,
        data: () => testUser
      };
      mockGetFn.mockResolvedValueOnce(mockSnapshot);
      mockDeleteFn.mockResolvedValueOnce({});

      const req = createMockRequest<DeleteUserParams>({ id: testUser.uid }, { uid: 'admin', email: 'admin@example.com', role: 'admin' as UserRole });
      const res = createMockResponse();

      await deleteUser(req, res, mockNext);

      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockDocFn).toHaveBeenCalledWith(testUser.uid);
      expect(mockDeleteFn).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'User deleted successfully'
      });
    });

    it('should return 404 if user not found', async () => {
      const mockSnapshot = {
        exists: false
      };
      mockGetFn.mockResolvedValueOnce(mockSnapshot);

      const req = createMockRequest<DeleteUserParams>({ id: 'nonexistent' }, { uid: 'admin', email: 'admin@example.com', role: 'admin' as UserRole });
      const res = createMockResponse();

      await deleteUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });

    it('should handle errors', async () => {
      mockGetFn.mockRejectedValueOnce(new Error('Database error'));

      const req = createMockRequest<DeleteUserParams>({ id: 'user1' }, { uid: 'admin', email: 'admin@example.com', role: 'admin' as UserRole });
      const res = createMockResponse();

      await deleteUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to delete user'
      });
    });
  });

  describe('getDoctors', () => {
    it('should return all doctors', async () => {
      const doctors = testUsers.filter(user => user.role === 'doctor');
      // Mock Firestore response
      const mockSnapshot = {
        docs: doctors.map(doctor => ({
          id: doctor.uid,
          data: () => doctor
        }))
      };
      mockWhereFn.mockReturnThis();
      mockGetFn.mockResolvedValueOnce(mockSnapshot);

      const req = createMockRequest();
      const res = createMockResponse();

      await getDoctors(req, res, mockNext);

      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockWhereFn).toHaveBeenCalledWith('role', '==', 'doctor');
      expect(mockGetFn).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        doctors: doctors
      });
    });

    it('should handle errors', async () => {
      mockWhereFn.mockReturnThis();
      mockGetFn.mockRejectedValueOnce(new Error('Database error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await getDoctors(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch doctors'
      });
    });
  });

  describe('getDocumentsByUser', () => {
    it('should return documents for a user', async () => {
      const userId = 'user1';
      // Mock Firestore response
      const mockSnapshot = {
        docs: testDocuments.map(doc => ({
          id: doc.id,
          data: () => doc
        }))
      };
      mockWhereFn.mockReturnThis();
      mockGetFn.mockResolvedValueOnce(mockSnapshot);

      const req = createMockRequest<GetDocumentsByUserParams>({ userId }, { uid: userId, email: 'user1@example.com', role: 'patient' as UserRole });
      const res = createMockResponse();

      await getDocumentsByUser(req, res, mockNext);

      expect(mockFirestore.collection).toHaveBeenCalledWith('documents');
      expect(mockWhereFn).toHaveBeenCalledWith('userId', '==', userId);
      expect(mockGetFn).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        documents: testDocuments
      });
    });

    it('should handle errors', async () => {
      mockWhereFn.mockReturnThis();
      mockGetFn.mockRejectedValueOnce(new Error('Database error'));

      const req = createMockRequest<GetDocumentsByUserParams>({ userId: 'user1' }, { uid: 'user1', email: 'user1@example.com', role: 'patient' as UserRole });
      const res = createMockResponse();

      await getDocumentsByUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch documents'
      });
    });
  });
});