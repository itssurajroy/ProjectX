'use client';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Home, Bookmark, History, BarChart3, Trophy, User, Users, Calendar, Sparkles, PartyPopper, Palette } from 'lucide-react';
import SiteLogo from '@/components/layout/SiteLogo';
import { useUser } from '@/firebase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/layout/header';

const navItems = [
  { name: 'Home', icon: Home, href: '/dashboard' },
  { name: 'Watchlist', icon: Bookmark, href: '/dashboard/watchlist' },
  { name: 'History', icon: History, href: '/dashboard/history' },
  { name: 'Statistics', icon: BarChart3, href: '/dashboard/stats' },
  { name: 'Achievements', icon: Trophy, href: '/dashboard/achievements' },
  { name: 'Profile', icon: User, href: '/dashboard/profile' },
  { name: 'Friends', icon: Users, href: '/dashboard/friends' },
  { name: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
  { name: 'AI Curator', icon: Sparkles, href: '/dashboard/ai-curator' },
  { name: 'Watch Parties', icon: PartyPopper, href: '/dashboard/watch-parties' },
  { name: 'Theme Studio', icon: Palette, href: '/dashboard/theme-studio' },
];

const NavLink = ({ item, isExpanded }: { item: typeof navItems[0], isExpanded: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    return (
        <Link href={item.href} className={cn(
            "flex items-center gap-3 rounded-md transition-all duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            isActive && "text-primary bg-primary/10 font-semibold",
            isExpanded ? "px-3 py-2" : "h-10 w-10 justify-center"
        )}>
            <item.icon className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="truncate">{item.name}</span>}
        </Link>
    );
}

const MobileBottomNav = () => {
    const mobileNavItems = navItems.slice(0, 4); // Show first 4 items + a 'more' button
     const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t border-border z-40 lg:hidden">
            <div className="grid grid-cols-4 items-center justify-around h-full">
                {mobileNavItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className={cn(
                            "flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}>
                            <item.icon className="w-5 h-5" />
                            <span className="truncate">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const isExpanded = true; // For now, sidebar is always expanded

    return (
        <>
            <Header />
            <div className="flex min-h-screen pt-16">
                <aside className={cn(
                    "hidden lg:flex flex-col border-r border-border transition-all duration-300 ease-in-out bg-background fixed top-16 h-[calc(100vh-4rem)]",
                    isExpanded ? "w-64" : "w-16"
                )}>
                    <div className="p-4 flex items-center justify-between">
                         {user && isExpanded && (
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Avatar className="w-9 h-9">
                                    <AvatarImage src={user.photoURL!} />
                                    <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-sm font-semibold truncate">{user.displayName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                         )}
                    </div>
                    <nav className="flex-1 overflow-y-auto px-4 space-y-2">
                        {navItems.map(item => (
                            <NavLink key={item.href} item={item} isExpanded={isExpanded} />
                        ))}
                    </nav>
                </aside>
                <main className={cn(
                    "flex-1 transition-all duration-300 ease-in-out pb-16 lg:pb-0",
                    isExpanded ? "lg:ml-64" : "lg:ml-16"
                )}>
                    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                       {children}
                    </div>
                </main>
                <MobileBottomNav />
            </div>
        </>
    );
}
