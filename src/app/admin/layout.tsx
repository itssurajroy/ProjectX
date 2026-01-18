
'use client';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Home, Bookmark, History, User, LogOut, Shield, X, Menu, BarChart3, Trophy, Users, Calendar, Sparkles, PartyPopper, Tv, Settings, Flag, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import AdminLogo from '@/components/admin/AdminLogo';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, userProfile, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            toast.error("You must be logged in to view this page.");
            router.push('/login');
            return;
        }

        if (userProfile?.role !== 'admin') {
            toast.error("You do not have permission to access the admin panel.");
            router.push('/dashboard');
        }

    }, [user, userProfile, loading, router]);

    if (loading || !user || userProfile?.role !== 'admin') {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-16 h-16 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
            
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
                          <AdminLogo />
                          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-5 h-5"/>
                          </Button>
                        </div>
                        <AdminSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex flex-col border-r border-border bg-background fixed top-16 h-[calc(100vh-4rem)] w-64">
                    <AdminSidebar />
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
