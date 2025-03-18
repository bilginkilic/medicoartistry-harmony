import * as admin from 'firebase-admin';

// Initialize Firebase Admin for testing
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    storageBucket: `${serviceAccount.project_id}.appspot.com`
  });
}

export const testFirestore = admin.firestore();
export const testAuth = admin.auth();
export const testStorage = admin.storage();

describe('Firebase Test Configuration', () => {
  it('should initialize Firebase Admin SDK', () => {
    expect(admin.apps.length).toBe(1);
    expect(testFirestore).toBeDefined();
    expect(testAuth).toBeDefined();
    expect(testStorage).toBeDefined();
  });
}); 