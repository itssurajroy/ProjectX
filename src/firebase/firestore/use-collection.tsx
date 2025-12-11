
'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemoFirebase to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *  
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Directly use memoizedTargetRefOrQuery as it's assumed to be the final query
    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      async (serverError: FirestoreError) => {
        let path: string;
        // This is a workaround to get the path from a query.
        // @ts-ignore - _query is not part of the public API but necessary here.
        if ('_query' in memoizedTargetRefOrQuery && memoizedTargetRefOrQuery._query?.path?.segments) {
          // @ts-ignore
          path = memoizedTargetRefOrQuery._query.path.segments.join('/');
        } else {
          path = (memoizedTargetRefOrQuery as CollectionReference).path;
        }
        
        const isOfflineError = serverError.code === 'unavailable' || serverError.message.includes('offline');

        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: path,
        });

        // Use a more user-friendly error message for offline scenarios
        const finalError = isOfflineError 
            ? new Error("You're offline or Firebase is unreachable. Check your connection.")
            : contextualError;

        setError(finalError);
        setData(null);
        setIsLoading(false);

        // Only emit the detailed permission error for actual permission issues
        if (!isOfflineError) {
             errorEmitter.emit('permission-error', contextualError);
        }
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]); // Re-run if the target query/reference changes.
  
  if(memoizedTargetRefOrQuery && !(memoizedTargetRefOrQuery as any).__memo) {
    console.warn('The query/reference passed to useCollection was not memoized with useMemoFirebase. This can lead to infinite loops.', memoizedTargetRefOrQuery);
  }

  return { data, isLoading, error };
}
