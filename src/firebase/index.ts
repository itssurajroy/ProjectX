// src/firebase/index.ts
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, setPersistence, browserSessionPersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { useMemo } from 'react';

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

/**
 * A hook that memoizes a Firestore query or reference.
 * This is CRITICAL to prevent infinite loops in `useCollection` and `useDoc` hooks.
 * @param factory A function that returns a Firestore query or reference.
 * @param deps The dependency array for the factory function.
 * @returns A memoized Firestore query or reference.
 */
export const useMemoFirebase = (factory: () => any, deps: any[]) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoizedQuery = useMemo(factory, deps);
    if(memoizedQuery) {
        (memoizedQuery as any).__memo = true;
    }
    return memoizedQuery;
}


// Export hooks and providers
export { FirebaseProvider, FirebaseContext, useAuth, useFirestore } from '@/firebase-provider';
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
