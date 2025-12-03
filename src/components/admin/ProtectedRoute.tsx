'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserRole } from "@/lib/adminRoles";

export default function ProtectedRoute({ children, requiredRole = "moderator" }: { 
  children: React.ReactNode;
  requiredRole?: "superadmin" | "admin" | "moderator" | "viewer";
}) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const role = await getUserRole(user.uid);
      if (!role || (role !== "superadmin" && role !== "admin" && role !== "moderator" && role !== "viewer")) {
        router.push("/");
        return;
      }

      if (requiredRole && role !== "superadmin" && role !== requiredRole) {
        router.push("/admin");
        return;
      }

      setAllowed(true);
      setLoading(false);
    });

    return () => unsub();
  }, [router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          PROJECT X ADMIN
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
