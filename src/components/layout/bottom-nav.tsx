'use client';

import { cn } from "@/lib/utils";
import { Home, Tv, Film, TrendingUp, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/tv", icon: Tv, label: "TV Series" },
    { href: "/movies", icon: Film, label: "Movies" },
    { href: "/top-airing", icon: TrendingUp, label: "Top Airing" },
    { href: "/genres", icon: LayoutGrid, label: "Genres" },
];

const BottomNavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={cn(
            "flex flex-col items-center justify-center gap-1 text-xs w-full h-full",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}>
            <Icon className="w-5 h-5" />
            <span className="truncate">{label}</span>
        </Link>
    );
};

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-border z-40 md:hidden">
            <div className="flex items-center justify-around h-full">
                {navItems.map(item => (
                    <BottomNavLink key={item.href} {...item} />
                ))}
            </div>
        </nav>
    );
}
