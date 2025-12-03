'use client';
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1">
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-purple-600 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className={`transition-all ${sidebarOpen ? "lg:ml-80" : "ml-0"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
