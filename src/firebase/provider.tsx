
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { UserProfile } from '@/lib/types/user';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { FirestorePermissionError } from './errors';
import { errorEmitter } from './error-emitter';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// User auth state + profile state
interface UserState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

// Return type for useUser()
export interface UserHookResult {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userState, setUserState] = useState<UserState>({
    user: null,
    userProfile: null,
    loading: true,
    error: null,
  });

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth || !firestore) {
      setUserState({ user: null, userProfile: null, loading: false, error: new Error("Auth or Firestore service not provided.") });
      return;
    }

    setUserState({ user: null, userProfile: null, loading: true, error: null });
    
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        // First, cancel any existing profile listener
        if (unsubscribeProfile) {
            unsubscribeProfile();
            unsubscribeProfile = null;
        }

        if (firebaseUser) {
          const userRef = doc(firestore, 'users', firebaseUser.uid);

          // Set up a new real-time listener for the user's profile
          unsubscribeProfile = onSnapshot(userRef, 
            (userSnap) => {
              if (userSnap.exists()) {
                const profile = userSnap.data() as UserProfile;
                setUserState({ user: firebaseUser, userProfile: profile, loading: false, error: null });

                const isAdmin = firebaseUser.email === 'admin@projectx.com';
                const updatesToPerform: Partial<UserProfile> = { lastLogin: serverTimestamp() };
                
                // Also ensure the admin role is correctly set for the specific admin user.
                if (isAdmin && profile.role !== 'admin') {
                  updatesToPerform.role = 'admin';
                }
            
                // Non-blocking update for last login and potentially role.
                // The onSnapshot listener will catch any changes and update the UI.
                setDocumentNonBlocking(userRef, updatesToPerform, { merge: true });

              } else {
                // New user, create profile
                const isAdmin = firebaseUser.email === 'admin@projectx.com';
                const newUserProfile: UserProfile = {
                  id: firebaseUser.uid,
                  displayName: firebaseUser.displayName || (isAdmin ? 'Admin' : 'Anonymous'),
                  email: firebaseUser.email || '',
                  photoURL: firebaseUser.photoURL || '',
                  role: isAdmin ? 'admin' : 'user',
                  status: 'active',
                  createdAt: serverTimestamp(),
                  lastLogin: serverTimestamp(),
                  onboardingCompleted: false,
                };
                // Create profile, non-blocking. The listener will pick up the change.
                setDocumentNonBlocking(userRef, newUserProfile, { merge: false });
              }
            },
            (e: any) => {
              let errorToReport: Error;
              if (e.code === 'permission-denied') {
                  errorToReport = new FirestorePermissionError({ operation: 'get', path: userRef.path });
                  errorEmitter.emit('permission-error', errorToReport as FirestorePermissionError);
              } else {
                  console.error("FirebaseProvider user profile snapshot error:", e);
                  errorToReport = e; // Use the original error
              }
              setUserState({ user: firebaseUser, userProfile: null, loading: false, error: errorToReport });
            }
          );
          
        } else {
          // User is signed out
          setUserState({ user: null, userProfile: null, loading: false, error: null });
        }
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserState({ user: null, userProfile: null, loading: false, error: error });
      }
    );

    return () => {
        unsubscribeAuth();
        if (unsubscribeProfile) {
            unsubscribeProfile();
        }
    };
  }, [auth, firestore]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userState.user,
      userProfile: userState.userProfile,
      loading: userState.loading,
      error: userState.error,
    };
  }, [firebaseApp, firestore, auth, userState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    userProfile: context.userProfile,
    loading: context.loading,
    error: context.error,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const { user, userProfile, loading, error } = useFirebase();
  return { user, userProfile, loading, error };
};
