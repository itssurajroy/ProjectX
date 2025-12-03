
'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserRole, type AdminRole } from "@/lib/adminRoles";

const ADMIN_ROLES: AdminRole[] = ["superadmin", "admin", "moderator", "viewer"];

export default function ProtectedRoute({ children, requiredRole }: { 
  children: React.ReactNode;
  requiredRole?: AdminRole;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not logged in, redirect to login page.
        router.push("/login?redirect=/admin");
        return;
      }

      // User is logged in, now check their role.
      const userRole = await getUserRole(user.uid);
      
      // Check if the user's role is one of the valid admin roles.
      const hasAdminAccess = userRole && ADMIN_ROLES.includes(userRole);

      if (hasAdminAccess) {
        // If a specific role is required, check against it.
        // The checkPermission logic can be more granular.
        const hasRequiredRole = requiredRole ? userRole === requiredRole || userRole === 'superadmin' : true;
        
        if(hasRequiredRole) {
            setIsAuthorized(true);
        } else {
            // Has admin access but not the required role, redirect to dashboard.
             router.push("/admin");
        }
      } else {
        // Not an admin user, redirect to home page.
        router.push("/home");
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          Verifying Clearance...
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
