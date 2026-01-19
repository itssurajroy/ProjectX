
import * as admin from 'firebase-admin';

// This function initializes the admin app if it hasn't been already.
function initializeAdminApp() {
  if (!admin.apps.length) {
    // This check is for Vercel/serverless environments.
    // Ensure you have these environment variables set in your deployment settings.
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        // In a real app, you might have a more sophisticated logging or alert system here.
        console.error("Firebase Admin SDK environment variables are not set. The app will not function correctly on the server.");
        // We throw an error to make it clear that initialization is not possible.
        throw new Error("Server configuration error: Missing Firebase Admin credentials.");
    }

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines from environment variable
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase Admin initialization error:', error.stack);
      // Re-throw to prevent the app from continuing in a broken state.
      throw new Error("Could not initialize Firebase Admin SDK. Check server environment variables and credentials.");
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
