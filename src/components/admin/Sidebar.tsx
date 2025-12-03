'use client';
import Link from "next/link";
import { Home, Users, MessageSquare, Bell, Settings, FileText, Cache, Globe, Shield, Activity } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Comments", icon: MessageSquare, href: "/admin/comments" },
  { name: "Reports", icon: Bell, href: "/admin/reports", badge: 17 },
  { name: "Announcements", icon: FileText, href: "/admin/announcements", badge: 5 },
  { name: "Cache", icon: Cache, href: "/admin/cache" },
  { name: "SEO", icon: Globe, href: "/admin/seo" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
  { name: "Logs", icon: Activity, href: "/admin/logs" },
];

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-950 border-r border-purple-500/20 transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
      <div className="p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Project X Admin
        </h1>
      </div>
      <nav className="px-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-purple-900/50 transition"
          >
            <item.icon className="w-6 h-6" />
            <span className="font-medium">{item.name}</span>
            {item.badge && (
              <span className="ml-auto px-3 py-1 bg-red-500 rounded-full text-sm">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
