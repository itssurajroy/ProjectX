
'use client';

import { cn } from "@/lib/utils";
import { Home, Bookmark, LayoutGrid, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href === '/dashboard' && pathname.startsWith('/dashboard'));

    return (
        <Link href={href} className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}>
            <Icon className="w-5 h-5" />
            <span className="truncate">{label}</span>
        </Link>
    );
};

export default function MobileBottomNav() {
    const navItemsLeft = [
        { href: "/home", icon: Home, label: "Home" },
        { href: "/dashboard/watchlist", icon: Bookmark, label: "My Lists" },
    ];
    const navItemsRight = [
        { href: "/az-list/all", icon: LayoutGrid, label: "Browse" },
        { href: "/dashboard", icon: User, label: "Account" },
    ];
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t border-border z-40 md:hidden hide-in-landscape">
            <div className="relative grid grid-cols-5 items-center h-full">
                {navItemsLeft.map(item => (
                    <NavLink key={item.href} {...item} />
                ))}

                <div className="col-start-3 flex justify-center">
                    {/* Floating center button */}
                </div>

                {navItemsRight.map(item => (
                    <NavLink key={item.href} {...item} />
                ))}

                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
                    <Link href="/search" className="w-16 h-16 flex items-center justify-center bg-primary rounded-full shadow-lg shadow-primary/30 text-primary-foreground transform -translate-y-4 hover:scale-110 transition-transform">
                        <Search className="w-7 h-7" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
