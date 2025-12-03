
'use client';
import Link from "next/link";
import { Home, Users, MessageSquare, AlertCircle, Megaphone, HelpCircle, Link2, Cache, Globe, Settings, Activity } from "lucide-react";

const nav = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Comments", href: "/admin/comments", icon: MessageSquare },
  { name: "Reports", href: "/admin/reports", icon: AlertCircle, badge: 17 },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone, badge: 5 },
  { name: "Requests", href: "/admin/requests", icon: HelpCircle },
  { name: "Socials", href: "/admin/socials", icon: Link2 },
  { name: "Cache", href: "/admin/cache", icon: Cache },
  { name: "SEO", href: "/admin/seo", icon: Globe },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Logs", href: "/admin/logs", icon: Activity },
];

export default function Sidebar({ current }: { current: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 w-80 bg-gray-950 border-r border-purple-500/20 z-50">
      <div className="p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Project X Admin
        </h1>
      </div>
      <nav className="px-6 space-y-2">
        {nav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
              current === item.name.toLowerCase().replace(" ", "")
                ? "bg-purple-900/50 border border-purple-500"
                : "hover:bg-gray-900"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="font-medium">{item.name}</span>
            {item.badge && (
              <span className="ml-auto px-3 py-1 bg-red-600 rounded-full text-sm font-bold">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
