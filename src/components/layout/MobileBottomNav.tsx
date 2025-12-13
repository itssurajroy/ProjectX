
'use client';

import { cn } from "@/lib/utils";
import { Home, Bookmark, LayoutGrid, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (pathname.startsWith(href) && href !== '/home');

    return (
        <Link href={href} className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}>
            <Icon className="w-6 h-6" />
            <span className="truncate">{label}</span>
        </Link>
    );
};

export default function MobileBottomNav() {
    const navItems = [
        { href: "/home", icon: Home, label: "Home" },
        { href: "/dashboard/watchlist", icon: Bookmark, label: "My Lists" },
        { href: "/az-list/all", icon: LayoutGrid, label: "Browse" },
        { href: "/search", icon: Search, label: "Search" },
        { href: "/dashboard", icon: User, label: "Account" },
    ];
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t border-border z-40 md:hidden hide-in-landscape">
            <div className="grid grid-cols-5 items-center h-full">
                {navItems.map(item => (
                    <NavLink key={item.href} {...item} />
                ))}
            </div>
        </nav>
    );
}
