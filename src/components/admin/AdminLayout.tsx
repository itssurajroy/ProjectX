'use client';
import { useEffect, useState, ReactNode } from "react";
import { getUserRole } from "@/lib/adminRoles";
import { auth } from "@/lib/firebase";
import Sidebar from "./Sidebar";
import ProtectedRoute from "./ProtectedRoute"; // Assuming this is the correct path

export function AdminLayout({ children, current }: { children: ReactNode; current: string }) {
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const r = await getUserRole(user.uid);
        setRole(r || "viewer");
      }
    });
    return unsub;
  }, []);

  return (
    <ProtectedRoute requiredRole="viewer">
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar current={current} userRole={role} />
        <main className="flex-1 lg:ml-80 p-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold">Welcome, <span className="capitalize">{role}</span></h1>
            {role === "superadmin" && <span className="px-6 py-3 bg-red-600 rounded-full text-xl font-bold">GOD MODE</span>}
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
