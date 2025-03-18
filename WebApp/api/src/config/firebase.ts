import * as admin from 'firebase-admin';
import * as serviceAccount from './firebaseConfig.json';

// Initialize Firebase app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: 'medioart-32f88.appspot.com'
  });
}

export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin; 