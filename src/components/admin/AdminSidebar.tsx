'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
    Home, Tv, Users, Flag, Settings, LogOut, BarChart3, LineChart, PenSquare,
    MessageSquare, Files, Menu, Megaphone, CreditCard, Plug, FileWarning, Library, TrendingUp, Bell 
} from 'lucide-react';
import { useAuth } from '@/firebase';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const navItems = [
  // General
  { name: 'Dashboard', icon: Home, href: '/admin' },
  { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { name: 'Reports', icon: FileWarning, href: '/admin/reports' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },

  // Content Management
  { name: 'Anime', icon: Tv, href: '/admin/anime' },
  { name: 'Blog', icon: PenSquare, href: '/admin/blog' },
  { name: 'Comments', icon: MessageSquare, href: '/admin/comments' },
  { name: 'Pages', icon: Files, href: '/admin/pages' },
  { name: 'Menus', icon: Menu, href: '/admin/menus' },
  { name: 'Media Library', icon: Library, href: '/admin/media' },
  { name: 'Trending', icon: TrendingUp, href: '/admin/trending' },
  
  // User & Community
  { name: 'Users', icon: Users, href: '/admin/users' },
  { name: 'Moderation', icon: Flag, href: '/admin/moderation' },

  // System & SEO
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
  { name: 'SEO', icon: LineChart, href: '/admin/seo' },
  { name: 'Advertisement', icon: Megaphone, href: '/admin/ads' },
  { name: 'API Integration', icon: Plug, href: '/admin/api-settings' },
];

const NavLink = ({ item, onClick }: { item: typeof navItems[0], onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    return (
        <Link 
            href={item.href} 
            className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 border-l-4",
                isActive 
                    ? 'bg-primary/10 border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-primary/50'
            )} 
            onClick={onClick}
        >
            <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
            <span className="truncate">{item.name}</span>
        </Link>
    );
}

export default function AdminSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
    const router = useRouter();
    const auth = useAuth();

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
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
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
