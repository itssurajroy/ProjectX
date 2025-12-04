
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, setPersistence, browserSessionPersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';


// IMPORTANT: This is the single source of truth for Firebase initialization.
// It is wrapped in a function to ensure it's only called on the client.
export function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyBQSy1kHNRYvp2b-l0jnsUd44P-cXkJZDY",
    authDomain: "studio-8183683078-60ab0.firebaseapp.com",
    projectId: "studio-8183683078-60ab0",
    storageBucket: "studio-8183683078-60ab0.appspot.com",
    messagingSenderId: "20761769952",
    appId: "1:20761769952:web:1a66600ebcca874bc81d85"
  };

  let firebaseApp: FirebaseApp;
  let auth: Auth;
  let firestore: Firestore;

  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  // Set session persistence to ensure user stays logged in.
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserSessionPersistence);
  }
  
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
