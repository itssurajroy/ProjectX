
'use client';
import { useFirebase } from '@/firebase/provider';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/types/user';

export interface UseUserResult {
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, profile data, loading status, and any auth errors.
 * @returns {UseUserResult} Object with user, profile, isUserLoading, userError.
 */
export const useUser = (): UseUserResult => {
  const { user, profile, isUserLoading, userError } = useFirebase();
  return { user, profile, isUserLoading, userError };
};
