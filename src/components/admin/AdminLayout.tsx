
'use client';
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
        // Use a class to identify the sidebar and its trigger
        if (!(e.target as Element).closest('.admin-sidebar') && !(e.target as Element).closest('.admin-sidebar-trigger')) {
            setSidebarOpen(false);
        }
    };
    // Use a timeout to prevent the event from firing immediately on open
    setTimeout(() => document.addEventListener("click", handleOutsideClick), 0);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-black">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-50 w-80 bg-gray-950 border-r border-purple-500/20 transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto"
        )}
      >
        <div className="flex flex-col h-full">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-gray-950 border-b border-purple-500/20 px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ProjectX
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-sidebar-trigger p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition"
          >
            {sidebarOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black via-purple-950/10 to-black">
          <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

    