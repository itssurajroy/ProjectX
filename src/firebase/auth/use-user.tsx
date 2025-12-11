
// src/firebase/auth/use-user.tsx
'use client';
import { useContext } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types/user';
import { FirebaseContext } from '@/firebase/client-provider';

export interface UseUserResult {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UseUserResult {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useUser must be used within a FirebaseProvider');
  }

  const { user, userProfile, loading, error } = context;
  return { user, userProfile, loading, error };
}
