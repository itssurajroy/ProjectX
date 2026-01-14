// src/lib/firebaseAdmin.ts
import 'dotenv/config';
import * as admin from 'firebase-admin';

// IMPORTANT: Set these environment variables in your Vercel/deployment environment.
// Do not hardcode them here.
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    });
    console.log('Firebase Admin SDK initialized.');
  } catch (error: any) {
    console.error('Firebase Admin initialization error', error.stack);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
