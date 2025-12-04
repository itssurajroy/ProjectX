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
  apiKey: "AIzaSyBQSy1kHNRYvp2b-l0jnsUd44P-cXkJZDY",
  authDomain: "studio-8183683078-60ab0.firebaseapp.com",
  projectId: "studio-8183683078-60ab0",
  storageBucket: "studio-8183683078-60ab0.appspot.com",
  messagingSenderId: "20761769952",
  appId: "1:20761769952:web:1a66600ebcca874bc81d85"
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
