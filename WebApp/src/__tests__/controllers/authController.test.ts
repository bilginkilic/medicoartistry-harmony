import request from 'supertest';
import app from '../../app';
import admin from '../../config/firebase';

describe('Auth Controller Tests', () => {
  let testUserEmail: string;
  let testUserPassword: string;
  let testUserUid: string;

  beforeAll(() => {
    testUserEmail = `test${Date.now()}@example.com`;
    testUserPassword = 'Test123!@#';
  });

  afterAll(async () => {
    // Clean up test user if exists
    try {
      const user = await admin.auth().getUserByEmail(testUserEmail);
      if (user) {
        await admin.auth().deleteUser(user.uid);
        await admin.firestore().collection('users').doc(user.uid).delete();
      }
    } catch (error) {
      // Ignore error if user doesn't exist
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          fullName: 'Test User',
          phoneNumber: '+905551234567',
          role: 'visitor'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUserEmail);
      expect(response.body.message).toBe('User registered successfully');

      testUserUid = response.body.user.uid;
    });

    it('should not register a user with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          fullName: 'Test User 2',
          phoneNumber: '+905551234568',
          role: 'visitor'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // too short
          role: 'invalid-role'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserEmail,
          password: testUserPassword
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUserEmail);
      expect(response.body.message).toBe('Login successful');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserEmail,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUserPassword
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should send reset password email for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: testUserEmail
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset email sent successfully');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    let refreshToken: string;

    beforeAll(async () => {
      // Login to get a refresh token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserEmail,
          password: testUserPassword
        });

      refreshToken = loginResponse.body.token;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({
          refreshToken
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({
          refreshToken: 'invalid-token'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid refresh token');
    });
  });
}); 