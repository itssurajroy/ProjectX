
'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, MessageSquare, AlertCircle, Megaphone, Settings, Activity, Shield, Cache, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Comments", icon: MessageSquare, href: "/admin/comments" },
  { name: "Reports", icon: AlertCircle, href: "/admin/reports", badge: 17 },
  { name: "Announcements", icon: Megaphone, href: "/admin/announcements", badge: 5 },
  { name: "Cache", icon: Cache, href: "/admin/cache" },
  { name: "SEO", icon: Globe, href: "/admin/seo" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
  { name: "Logs", icon: Activity, href: "/admin/logs" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-8 border-b border-purple-500/20">
        <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          ProjectX
        </h1>
        <p className="text-purple-400 text-sm mt-2">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-600/30"
                  : "hover:bg-gray-800/60 text-gray-300 hover:text-white"
              )}
            >
              <item.icon className={cn("w-7 h-7", isActive && "drop-shadow-glow")} />
              <span className="text-lg font-semibold">{item.name}</span>
              {item.badge && (
                <span className="ml-auto px-3 py-1.5 bg-red-600 rounded-full text-sm font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-purple-500/20">
        <button onClick={handleLogout} className="w-full mt-auto px-6 py-4 bg-red-600 rounded-xl text-lg font-bold hover:bg-red-700">
          Logout
        </button>
        <div className="text-center text-gray-500 text-sm mt-4">
          © 2025 ProjectX
        </div>
      </div>
    </div>
  );
}
