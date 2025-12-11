// src/firebase-provider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import { type Auth, onAuthStateChanged, type User } from 'firebase/auth';
import { type Firestore, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/types/user';
import { useMemoFirebase } from '@/firebase';

interface UserAuthState {
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  areServicesAvailable: boolean;
  userAuthState: UserAuthState;
}

// Create a context with a default value.
export const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

/**
 * Provider component that holds Firebase state and initialized services.
 * It listens to auth state changes and fetches the user profile.
 */
export function FirebaseProvider({
  firebaseApp,
  auth,
  firestore,
  children,
}: {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: ReactNode;
}) {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    profile: null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUserAuthState(prevState => ({ ...prevState, user, isUserLoading: false }));

      if (user) {
        // When user logs in, create/update their profile document
        const userDocRef = doc(firestore, 'users', user.uid);
        try {
            await setDoc(userDocRef, {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                lastLogin: serverTimestamp(),
                // Set default role and createdAt only on initial creation
                role: 'user', 
                createdAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error creating/updating user profile:", error);
            // Optionally, handle this error in the UI
        }
      }

    }, (error) => {
      setUserAuthState(prevState => ({ ...prevState, userError: error, isUserLoading: false }));
    });
    return () => unsubscribe();
  }, [auth, firestore]);


  const userDocRef = useMemoFirebase(
    () => (userAuthState.user ? doc(firestore, 'users', userAuthState.user.uid) : null),
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
        // If user logs out, clear profile
        setUserAuthState(prevState => ({...prevState, profile: null}));
    }
  }, [userDocRef]);


  const value = useMemo(() => ({
    firebaseApp,
    auth,
    firestore,
    areServicesAvailable: !!(firebaseApp && auth && firestore),
    userAuthState,
  }), [firebaseApp, auth, firestore, userAuthState]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}


// HOOKS

/**
 * Custom hook to access the full Firebase context, including app, auth, and firestore instances.
 * @returns {FirebaseContextType} The full Firebase context.
 * @throws Will throw an error if used outside of a FirebaseProvider.
 */
export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context || !context.areServicesAvailable) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }
  return context;
};

/**
 * Custom hook that returns only the initialized Firestore instance.
 * @returns {Firestore} The Firestore instance.
 * @throws Will throw an error if used outside of a FirebaseProvider.
 */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/**
 * Custom hook that returns only the initialized Auth instance.
 * @returns {Auth} The Firebase Auth instance.
 * @throws Will throw an error if used outside of a FirebaseProvider.
 */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};
