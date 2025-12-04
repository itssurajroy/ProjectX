
'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, MessageSquare, AlertCircle, Megaphone, Settings, Activity, Shield, Cache, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import SiteLogo from "../layout/SiteLogo";

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
  { name: "Permissions", icon: Shield, href: "/admin/permissions" },
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
      <div className="p-4 border-b border-border h-16 flex items-center">
        <SiteLogo />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-destructive text-destructive-foreground rounded-full text-xs font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button onClick={handleLogout} className="w-full mt-auto px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-bold hover:bg-destructive/90">
          Logout
        </button>
        <div className="text-center text-muted-foreground text-xs mt-4">
          © 2025 ProjectX
        </div>
      </div>
    </div>
  );
}
