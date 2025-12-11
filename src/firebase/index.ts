
// src/firebase/index.ts
'use client';

import { useMemo } from 'react';

// IMPORTANT: This file is now primarily for memoization and re-exporting.
// The main initialization and provider logic is in client-provider.tsx.

/**
 * A hook that memoizes a Firestore query or reference.
 * This is CRITICAL to prevent infinite loops in `useCollection` and `useDoc` hooks.
 * @param factory A function that returns a Firestore query or reference.
 * @param deps The dependency array for the factory function.
 * @returns A memoized Firestore query or reference.
 */
export const useMemoFirebase = (factory: () => any, deps: any[]) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoizedQuery = useMemo(factory, deps);
    if(memoizedQuery) {
        (memoizedQuery as any).__memo = true;
    }
    return memoizedQuery;
}


// Export hooks and providers from the main client-provider
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './errors';
export * from './error-emitter';
