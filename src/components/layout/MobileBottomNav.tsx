
'use client';

import { cn } from "@/lib/utils";
import { Home, Clapperboard, Bookmark, History, Tv } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

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
    const navItems = [
        { href: "/home", icon: Home, label: "Home" },
        { href: "/movies", icon: Clapperboard, label: "Movies" },
        { href: "/tv", icon: Tv, label: "TV" },
    ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t border-border z-40 md:hidden hide-in-landscape">
            <div className="grid grid-cols-3 items-center justify-around h-full">
                {navItems.map(item => (
                    <NavLink key={item.href} {...item} />
                ))}
            </div>
        </nav>
    );
}
