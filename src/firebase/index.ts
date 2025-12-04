
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration is securely sourced from environment variables.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function createFirebaseApp() {
    if (getApps().length > 0) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

// IMPORTANT: This is the single source of truth for Firebase initialization.
export function initializeFirebase() {
  const firebaseApp = createFirebaseApp();
  const auth = getAuth(firebaseApp);
  
  // Set session persistence to ensure user stays logged in.
  // This is a client-side only operation.
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserSessionPersistence);
  }

  const firestore = getFirestore(firebaseApp);
  
  return {
    firebaseApp,
    auth,
    firestore,
  };
}

// Export hooks and providers
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// Export auth providers for convenience
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// For components that need direct SDK access, they should get it from the context.
// However, for admin panel server actions or other specific cases, we can export initialized instances.
// Note: This might still cause issues if accessed before initialization is complete.
// Prefer using hooks like useAuth() and useFirestore() where possible.
const { auth, firestore } = initializeFirebase();
export { auth, firestore };
