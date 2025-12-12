
'use client';
import { Button } from '@/components/ui/button';
import SiteLogo from '@/components/layout/SiteLogo';
import { Menu, Bell, Shuffle, Users } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center bg-background/90 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto flex items-center justify-between gap-2">
                <Button variant="ghost" size="icon" onClick={onMenuClick}>
                    <Menu className="w-5 h-5" />
                </Button>
                <div className="flex-1 flex justify-center">
                   <SiteLogo />
                </div>
                 <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/random" title="Random Anime">
                            <Shuffle className="w-5 h-5 text-primary" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" title="Notifications">
                        <Link href="/dashboard/notifications"><Bell className="w-5 h-5" /></Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
