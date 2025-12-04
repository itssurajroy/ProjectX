'use client';
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clapperboard, Users, BarChart } from "lucide-react";
import SiteLogo from "@/components/layout/SiteLogo";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/anime", label: "Anime", icon: Clapperboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
];

const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    return (
        <Link 
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-bold transition-all duration-200",
                isActive ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]" : "text-gray-400 hover:bg-gray-800/70 hover:text-white"
            )}
        >
            <item.icon className="w-6 h-6" />
            <span>{item.label}</span>
        </Link>
    )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <aside className="w-72 bg-gray-900/80 border-r border-purple-500/20 p-6 flex flex-col gap-10">
        <div className="border-b border-purple-500/20 pb-6">
            <SiteLogo />
        </div>
        <nav className="flex flex-col gap-4">
            {navItems.map(item => (
                <NavLink key={item.href} item={item} />
            ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
