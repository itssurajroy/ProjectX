
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import { type Auth, onAuthStateChanged, type User } from 'firebase/auth';
import { type Firestore, doc, onSnapshot, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/types/user';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/index';
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

interface UserAuthState {
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  areServicesAvailable: boolean;
  userAuthState: UserAuthState;
}

export const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    profile: null,
    isUserLoading: true,
    userError: null,
  });

  const firebaseServices = useMemo(() => {
    try {
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestore = getFirestore(app);
      return { app, auth, firestore, available: true };
    } catch (e) {
      console.error("Failed to initialize Firebase", e);
      return { app: null, auth: null, firestore: null, available: false };
    }
  }, []);

  const { app: firebaseApp, auth, firestore } = firebaseServices;

  useEffect(() => {
    if (!auth || !firestore) {
      setUserAuthState(prevState => ({ ...prevState, isUserLoading: false, userError: new Error("Firebase not initialized") }));
      return;
    }
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUserAuthState(prevState => ({ ...prevState, user, isUserLoading: true })); // Start loading
  
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (!docSnap.exists()) {
            // Document doesn't exist, create it
            const newUserProfile: UserProfile = {
              displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
              email: user.email || '',
              photoURL: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
              role: 'user',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };
            await setDoc(userDocRef, newUserProfile);
          } else {
            // Document exists, update last login
            await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
          }
        } catch (error) {
          console.error("Error creating/updating user profile:", error);
          setUserAuthState(prevState => ({ ...prevState, userError: error as Error }));
        }
      }
      setUserAuthState(prevState => ({ ...prevState, isUserLoading: false })); // Stop loading
    }, (error) => {
      console.error("Auth state change error:", error);
      setUserAuthState(prevState => ({ ...prevState, userError: error, isUserLoading: false }));
    });
  
    return () => unsubscribe();
  }, [auth, firestore]);
  

  const userDocRef = useMemoFirebase(
    () => (userAuthState.user && firestore ? doc(firestore, 'users', userAuthState.user.uid) : null),
    [firestore, userAuthState.user]
  );

  useEffect(() => {
    if (userDocRef) {
      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const profileData = snapshot.exists() ? (snapshot.data() as UserProfile) : null;
        setUserAuthState(prevState => ({ ...prevState, profile: profileData }));
      }, (error) => {
        console.error("Error fetching user profile:", error);
        setUserAuthState(prevState => ({ ...prevState, userError: error }));
      });
      return () => unsubscribe();
    } else {
      setUserAuthState(prevState => ({...prevState, profile: null}));
    }
  }, [userDocRef]);

  const value = useMemo(() => ({
    firebaseApp,
    auth,
    firestore,
    areServicesAvailable: firebaseServices.available,
    userAuthState,
  }), [firebaseApp, auth, firestore, userAuthState, firebaseServices.available]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = (): Auth | null => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore | null => {
  const { firestore } = useFirebase();
  return firestore;
};
