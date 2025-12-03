
'use client';
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser, checkPermission, AdminRole } from "@/firebase";
import Loading from "@/app/loading";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: AdminRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const verifyRole = async () => {
        // You need a function to get the role from Firestore
        // For now, let's assume a function `getUserRole(uid)` exists
        // This would be a new file e.g., `src/lib/adminRoles.ts`
        const userRole: AdminRole = "superadmin"; // Replace with actual role fetching
        const hasPermission = checkPermission(userRole, requiredRole);
        
        if(hasPermission) {
            setIsAuthorized(true);
        } else {
            router.replace('/admin/unauthorized'); // Or a general 403 page
        }
        setIsCheckingRole(false);
    };

    verifyRole();

  }, [user, isUserLoading, router, requiredRole]);

  if (isUserLoading || isCheckingRole) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return null; // Or a specific "Access Denied" component
  }

  return <>{children}</>;
}
