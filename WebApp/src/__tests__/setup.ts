import dotenv from 'dotenv';
import admin from '../config/firebase';

dotenv.config();

// Global test setup
beforeAll(async () => {
  // Firebase setup is already done in ../config/firebase.ts
});

// Global test teardown
afterAll(async () => {
  await admin.app().delete();
}); 