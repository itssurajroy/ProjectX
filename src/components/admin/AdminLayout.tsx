
'use client';
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export function AdminLayout({ children, current }: { children: ReactNode; current: string }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar current={current} />
      <main className="flex-1 lg:ml-80 p-8">
        {children}
      </main>
    </div>
  );
}
