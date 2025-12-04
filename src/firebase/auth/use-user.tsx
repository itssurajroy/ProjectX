
'use client';
import { useContext } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/types/user';
import { FirebaseContext } from '@/firebase/provider';

export interface UseUserResult {
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, profile data, loading status, and any auth errors.
 * It consumes the FirebaseContext directly.
 * @returns {UseUserResult} Object with user, profile, isUserLoading, userError.
 */
export const useUser = (): UseUserResult => {
  const context = useContext(FirebaseContext);

  if (!context) {
    // This error indicates a programming mistake: using the hook outside its provider.
    throw new Error('useUser must be used within a FirebaseProvider.');
  }

  const { user, isUserLoading, userError, profile } = context.userAuthState;
  
  return { user, profile, isUserLoading, userError };
};
