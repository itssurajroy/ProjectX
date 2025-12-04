
'use client';
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SiteLogo from "../layout/SiteLogo";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
        if (!(e.target as Element).closest('.admin-sidebar') && !(e.target as Element).closest('.admin-sidebar-trigger')) {
            setSidebarOpen(false);
        }
    };
    setTimeout(() => document.addEventListener("click", handleOutsideClick), 0);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto"
        )}
      >
        <div className="flex flex-col h-full">
          <Sidebar />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-card border-b border-border px-4 h-16 flex items-center justify-between">
          <SiteLogo />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-sidebar-trigger p-2 text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="px-4 py-6 lg:px-8 lg:py-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
