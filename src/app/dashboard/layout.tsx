'use client';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Home, Bookmark, History, User, LogOut, Shield, X, Menu, BarChart3, Trophy, Users, Calendar, Sparkles, PartyPopper, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/layout/header';
import { useUser, useAuth } from '@/firebase';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import SiteLogo from '@/components/layout/SiteLogo';
import AnnouncementBanner from '@/components/layout/AnnouncementBanner';

const desktopNavItems = [
  { name: 'Home', icon: Home, href: '/dashboard' },
  { name: 'Watchlist', icon: Bookmark, href: '/dashboard/watchlist' },
  { name: 'History', icon: History, href: '/dashboard/history' },
  { name: 'Profile', icon: User, href: '/dashboard/profile' },
  { name: 'Statistics', icon: BarChart3, href: '/dashboard/stats' },
  { name: 'Achievements', icon: Trophy, href: '/dashboard/achievements' },
  { name: 'Friends', icon: Users, href: '/dashboard/friends' },
  { name: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
  { name: 'AI Curator', icon: Sparkles, href: '/dashboard/ai-curator' },
  { name: 'Watch Parties', icon: PartyPopper, href: '/dashboard/watch-parties' },
];

const NavLink = ({ item, onClick }: { item: typeof desktopNavItems[0], onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    return (
        <Link href={item.href} className={cn(
            "flex items-center gap-3 rounded-md transition-all duration-200 px-3 py-2",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            isActive && "text-primary bg-primary/10 font-semibold"
        )} onClick={onClick}>
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="truncate">{item.name}</span>
        </Link>
    );
}

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    const { user, userProfile } = useUser();
    const auth = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
      try {
        await auth.signOut();
        toast.success("Signed out successfully.");
        router.push('/home');
      } catch (error) {
        toast.error("Failed to sign out.");
        console.error("Sign out error:", error);
      }
    };

    return (
        <>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={userProfile?.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.uid}`} />
                        <AvatarFallback>{userProfile?.displayName?.charAt(0) || 'G'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-semibold truncate">{userProfile?.displayName || 'Guest'}</p>
                        <p className="text-xs text-muted-foreground truncate">{userProfile?.email || 'guest@projectx.com'}</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 space-y-2">
                {desktopNavItems.map(item => (
                    <NavLink key={item.href} item={item} onClick={onLinkClick} />
                ))}
                 {userProfile?.role === 'admin' && (
                    <Link href="/admin" className={cn(
                        "flex items-center gap-3 rounded-md transition-all duration-200 px-3 py-2 mt-4",
                        "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                    )} onClick={onLinkClick}>
                        <Shield className="w-5 h-5 shrink-0" />
                        <span className="truncate font-semibold">Admin Panel</span>
                    </Link>
                 )}
            </nav>
            <div className="p-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5"/>
                    <span>Logout</span>
                </Button>
            </div>
        </>
    );
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <AnnouncementBanner />
            <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
            
            <div className="flex min-h-screen pt-16">
                {/* Mobile Sidebar */}
                 <div className={cn("fixed inset-0 z-50 flex lg:hidden", isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none")}>
                    <div 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn("absolute inset-0 bg-black/60 transition-opacity", isMobileMenuOpen ? "opacity-100" : "opacity-0")}
                    />
                    <div className={cn(
                        "relative z-10 w-64 bg-background border-r border-border h-full flex flex-col transition-transform duration-300 ease-in-out", 
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}>
                        <div className="flex items-center justify-between p-4 border-b border-border">
                          <SiteLogo />
                          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-5 h-5"/>
                          </Button>
                        </div>
                        <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex flex-col border-r border-border bg-background fixed top-16 h-[calc(100vh-4rem)] w-64">
                    <SidebarContent />
                </aside>

                <main className="flex-1 lg:ml-64">
                    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                       {children}
                    </div>
                </main>
            </div>
        </>
    );
}
