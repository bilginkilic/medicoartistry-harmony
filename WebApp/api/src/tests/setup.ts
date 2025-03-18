import { testFirestore, testAuth } from '../config/firebase.test';

// Set Jest timeout for all tests (increased for real Firebase operations)
jest.setTimeout(60000);

// Test data with realistic information
const testUsers = [
  {
    uid: 'test-patient-001',
    email: 'test.patient@medicoartistry.com',
    fullName: 'John Test Patient',
    role: 'patient',
    phoneNumber: '+12025550001',
    address: '123 Test St, Medical City, MC 12345',
    dateOfBirth: '1990-01-01',
    insuranceInfo: {
      provider: 'Test Health Insurance',
      policyNumber: 'THI123456789'
    }
  },
  {
    uid: 'test-doctor-001',
    email: 'test.doctor@medicoartistry.com',
    fullName: 'Dr. Jane Test Doctor',
    role: 'doctor',
    phoneNumber: '+12025550002',
    specialization: 'General Practice',
    licenseNumber: 'MD123456',
    availability: {
      monday: ['09:00-17:00'],
      tuesday: ['09:00-17:00'],
      wednesday: ['09:00-17:00'],
      thursday: ['09:00-17:00'],
      friday: ['09:00-17:00']
    }
  },
  {
    uid: 'test-admin-001',
    email: 'test.admin@medicoartistry.com',
    fullName: 'Admin Test User',
    role: 'admin',
    phoneNumber: '+12025550003',
    department: 'System Administration',
    accessLevel: 'full'
  }
];

const testDocuments = [
  {
    id: 'test-doc-001',
    userId: 'test-patient-001',
    title: 'Medical History Report',
    content: 'Detailed medical history report for testing purposes',
    type: 'medical_history',
    status: 'active',
    tags: ['history', 'general'],
    lastUpdatedBy: 'test-doctor-001'
  },
  {
    id: 'test-doc-002',
    userId: 'test-patient-001',
    title: 'Lab Test Results',
    content: 'Recent laboratory test results for testing purposes',
    type: 'lab_results',
    status: 'pending_review',
    tags: ['lab', 'blood_work'],
    lastUpdatedBy: 'test-doctor-001'
  }
];

// Seed test data
async function seedTestData() {
  try {
    console.log('Starting test data seeding...');

    // Create test users in Auth and Firestore
    for (const user of testUsers) {
      try {
        // Create user in Auth
        await testAuth.createUser({
          uid: user.uid,
          email: user.email,
          password: 'TestPassword123!',
          displayName: user.fullName,
          phoneNumber: user.phoneNumber
        });
        console.log(`Created Auth user: ${user.email}`);

        // Create user in Firestore
        await testFirestore.collection('users').doc(user.uid).set({
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
          isTestUser: true // Flag to identify test users
        });
        console.log(`Created Firestore user: ${user.email}`);
      } catch (error: any) {
        if (error.code === 'auth/uid-already-exists' || error.code === 'auth/email-already-exists') {
          console.log(`User ${user.email} already exists, skipping creation`);
          continue;
        }
        throw error;
      }
    }

    // Create test documents
    for (const doc of testDocuments) {
      try {
        await testFirestore.collection('documents').doc(doc.id).set({
          ...doc,
          createdAt: new Date(),
          updatedAt: new Date(),
          isTestDocument: true // Flag to identify test documents
        });
        console.log(`Created test document: ${doc.title}`);
      } catch (error) {
        console.error(`Error creating document ${doc.id}:`, error);
        throw error;
      }
    }

    console.log('Test data seeding completed successfully');
  } catch (error) {
    console.error('Error during test data seeding:', error);
    throw error;
  }
}

// Clean up test data
async function cleanupTestData() {
  try {
    console.log('Starting test data cleanup...');

    // Delete test users from Auth and Firestore
    for (const user of testUsers) {
      try {
        // Delete from Auth
        await testAuth.deleteUser(user.uid);
        console.log(`Deleted Auth user: ${user.email}`);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          console.log(`User ${user.email} not found in Auth, skipping deletion`);
        } else {
          console.error(`Error deleting Auth user ${user.email}:`, error);
        }
      }

      try {
        // Delete from Firestore
        await testFirestore.collection('users').doc(user.uid).delete();
        console.log(`Deleted Firestore user: ${user.email}`);
      } catch (error) {
        console.error(`Error deleting Firestore user ${user.email}:`, error);
      }
    }

    // Delete test documents
    for (const doc of testDocuments) {
      try {
        await testFirestore.collection('documents').doc(doc.id).delete();
        console.log(`Deleted test document: ${doc.title}`);
      } catch (error) {
        console.error(`Error deleting document ${doc.id}:`, error);
      }
    }

    // Additional cleanup: Delete any documents marked as test documents that might have been missed
    const testDocsQuery = await testFirestore.collection('documents')
      .where('isTestDocument', '==', true)
      .get();
    
    for (const doc of testDocsQuery.docs) {
      await doc.ref.delete();
      console.log(`Deleted additional test document: ${doc.id}`);
    }

    // Delete any users marked as test users that might have been missed
    const testUsersQuery = await testFirestore.collection('users')
      .where('isTestUser', '==', true)
      .get();
    
    for (const doc of testUsersQuery.docs) {
      try {
        await testAuth.deleteUser(doc.id);
      } catch (error) {
        console.log(`Could not delete Auth user ${doc.id}, might already be deleted`);
      }
      await doc.ref.delete();
      console.log(`Deleted additional test user: ${doc.id}`);
    }

    console.log('Test data cleanup completed successfully');
  } catch (error) {
    console.error('Error during test data cleanup:', error);
    throw error;
  }
}

// Before all tests
beforeAll(async () => {
  try {
    await seedTestData();
  } catch (error) {
    console.error('Error in beforeAll:', error);
    throw error;
  }
});

// After all tests
afterAll(async () => {
  try {
    await cleanupTestData();
  } catch (error) {
    console.error('Error in afterAll:', error);
    throw error;
  }
}); 