
// src/firebase/client-provider.tsx
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseProvider } from '@/firebase-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Centralized Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


/**
 * Initializes and provides Firebase services. This component ensures that Firebase is
 * initialized only once on the client and passes the services down to the FirebaseProvider.
 * It's the entry point for Firebase on the client side.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase app, auth, and firestore
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    
    // This object is now guaranteed to have the initialized services
    return { app, auth, firestore };
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.app}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
      {/* FirebaseErrorListener is a client component that can be placed here */}
      <FirebaseErrorListener />
    </FirebaseProvider>
  );
}

// Renamed from useUserPanel to avoid confusion with useUser
export const useUserPanel = () => {
    // This hook will now get its data from the FirebaseProvider's context.
    // The implementation of that provider needs to be updated to supply this.
    // For now, this is a placeholder.
    return {
        user: null,
        profile: null,
        isUserLoading: true,
        firestore: null,
    }
}
