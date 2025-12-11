
// src/firebase/firestore/useCollection.ts
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';

class FirestorePermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirestorePermissionError';
  }
}

export const useCollection = <T>(collectionPath: string, q?: Query) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionPath.includes('undefined')) { // Add this check
      setLoading(true);
      setError(null);
      
      const collectionRef = collection(db, collectionPath);
      const finalQuery = q || query(collectionRef);

      const unsubscribe = onSnapshot(
        finalQuery,
        (snapshot) => {
          const result: T[] = [];
          snapshot.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() } as T);
          });
          setData(result);
          setLoading(false);
        },
        (err: any) => {
          console.error(`Error fetching collection ${collectionPath}:`, err);
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
    } else {
        setLoading(false);
    }
  }, [collectionPath, q]);

  return { data, loading, error };
};
