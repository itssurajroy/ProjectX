'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, Tv, Users, Flag, Settings, LogOut, Calendar, FileUp, Activity } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { auth } from '@/firebase/client';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', icon: Home, href: '/admin' },
  { name: 'Anime', icon: Tv, href: '/admin/anime' },
  { name: 'Users', icon: Users, href: '/admin/users' },
  { name: 'Reviews', icon: Flag, href: '/admin/reviews' },
  { name: 'Activity Log', icon: Activity, href: '/admin/activity-log' },
  { name: 'Seasonal', icon: Calendar, href: '/admin/seasonal' },
  { name: 'Import/Export', icon: FileUp, href: '/admin/import-export' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

const NavLink = ({ item, onClick }: { item: typeof navItems[0], onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    return (
        <Link href={item.href} className={cn(
            "flex items-center gap-3 rounded-md transition-all duration-200 px-3 py-2",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            isActive && "text-foreground bg-muted font-semibold"
        )} onClick={onClick}>
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="truncate">{item.name}</span>
        </Link>
    );
}

export default function AdminSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
    const router = useRouter();

    const handleSignOut = async () => {
      try {
        await auth.signOut();
        toast.success("Signed out successfully.");
        router.push('/login');
      } catch (error) {
        toast.error("Failed to sign out.");
        console.error("Sign out error:", error);
      }
    };

    return (
        <div className="h-full flex flex-col">
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {navItems.map(item => (
                    <NavLink key={item.href} item={item} onClick={onLinkClick} />
                ))}
            </nav>
            <div className="p-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5"/>
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );
};
