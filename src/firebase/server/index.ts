
import * as admin from 'firebase-admin';

// This function initializes the admin app if it hasn't been already.
function initializeAdminApp() {
  if (!admin.apps.length) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      });
      console.log('Firebase Admin SDK initialized.');
    } catch (error: any) {
      // In a serverless environment, this can happen if env vars are missing.
      // We throw an error to make it clear that the initialization failed.
      console.error('Firebase Admin initialization error:', error.stack);
      throw new Error("Could not initialize Firebase Admin SDK. Check server environment variables.");
    }
  }
}

// Lazy getter for the Firestore database instance.
export function getAdminDb() {
  initializeAdminApp();
  return admin.firestore();
}

// Lazy getter for the Auth instance.
export function getAdminAuth() {
  initializeAdminApp();
  return admin.auth();
}
