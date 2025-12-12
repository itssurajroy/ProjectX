
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '.';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';


class FirestorePermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirestorePermissionError';
  }
}

export const useDoc = <T>(docPath: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docPath || docPath.includes('undefined')) {
        setLoading(false);
        setData(null);
        return;
    };
    
    setLoading(true);
    setError(null);
    
    const docRef = doc(db, docPath);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null); // Document does not exist
        }
        setLoading(false);
      },
      (err: any) => {
        console.error(`Error fetching document ${docPath}:`, err);
        if (err.code === 'permission-denied') {
          setError(new FirestorePermissionError('You do not have permission to access this data.'));
        } else if (err.code === 'unavailable') {
            setError(new Error("The service is currently unavailable. You may be offline."));
        } else {
          setError(new Error(getFirebaseErrorMessage(err.code) || 'An unknown error occurred.'));
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docPath]);

  return { data, loading, error };
};
