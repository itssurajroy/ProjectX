
'use client';
import { useState, useEffect } from 'react';
import { getUserRole, type AdminRole } from '@/lib/adminRoles';

export function useAdminRole(uid: string | undefined) {
  const [role, setRole] = useState<AdminRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    getUserRole(uid).then(userRole => {
      if (isMounted) {
        setRole(userRole);
        setIsLoading(false);
      }
    }).catch(() => {
        if (isMounted) {
            setRole(null);
            setIsLoading(false);
        }
    });

    return () => {
      isMounted = false;
    };
  }, [uid]);

  return { role, isLoading };
}
