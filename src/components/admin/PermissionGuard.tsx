'use client';
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { hasPermission } from "@/lib/adminRoles";
import { Permission } from "@/lib/permissions";

export default function PermissionGuard({ 
  permission, 
  children,
  fallback = <div className="text-red-500 text-2xl font-bold">ACCESS DENIED</div>
}: { 
  permission: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const user = auth.currentUser;
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const perms = Array.isArray(permission) ? permission : [permission];
      const results = await Promise.all(perms.map(p => hasPermission(user.uid, p)));
      setAllowed(results.every(r => r));
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
        if(user) check();
        else {
            setAllowed(false);
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, [permission]);

  if (loading) return <div className="text-4xl animate-pulse">Checking permissions...</div>;
  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
}
