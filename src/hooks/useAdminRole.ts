
'use client';
import { useState, useEffect } from 'react';
import { getUserRole, type AdminRole } from '@/lib/adminRoles';
import { useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';


export function useAdminRole(uid: string | undefined) {
  const [role, setRole] = useState<AdminRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!uid || !firestore) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const roleRef = doc(firestore, "adminRoles", uid);

    const unsubscribe = onSnapshot(roleRef, (docSnap) => {
        if (docSnap.exists()) {
            setRole(docSnap.data().role as AdminRole);
        } else {
            setRole(null);
        }
        setIsLoading(false);
    }, () => {
        setRole(null);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [uid, firestore]);

  return { role, isLoading };
}
