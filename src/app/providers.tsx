'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user, isUserLoading, userError } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
    if (userError) {
      console.error('Auth state error:', userError);
    }
  }, [user, isUserLoading, userError, auth]);

  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  );
}
