
'use client';
import { createContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { auth, db } from '.';
import { UserProfile } from '@/types/user';

export interface FirebaseContextValue {
  auth: Auth;
  db: Firestore;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextValue | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        try {
          setLoading(true);
          if (user) {
            setUser(user);
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              // Existing user
              setUserProfile(userSnap.data() as UserProfile);
              await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
            } else {
              // New user
              const newUserProfile: UserProfile = {
                displayName: user.displayName || 'Anonymous',
                email: user.email || '',
                photoURL: user.photoURL || '',
                role: 'user',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
              };
              await setDoc(userRef, newUserProfile);
              setUserProfile(newUserProfile);
            }
          } else {
            setUser(null);
            setUserProfile(null);
          }
        } catch (e: any) {
          setError(e);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      auth,
      db,
      user,
      userProfile,
      loading,
      error,
    }),
    [auth, db, user, userProfile, loading, error]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}
