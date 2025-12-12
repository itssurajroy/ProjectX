
'use client';
import { Button } from '@/components/ui/button';
import SiteLogo from '@/components/layout/SiteLogo';
import { Menu, Bell, Shuffle, Users } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase/auth/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { user, userProfile } = useUser();
    return (
        <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center bg-background/90 backdrop-blur-sm border-b border-border lg:hidden">
            <div className="container mx-auto flex items-center justify-between gap-2">
                <Button variant="ghost" size="icon" onClick={onMenuClick}>
                    <Menu className="w-5 h-5" />
                </Button>
                <div className="flex-1 flex justify-center">
                   <SiteLogo />
                </div>
                 <div className="flex items-center gap-1">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile?.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.uid}`} />
                        <AvatarFallback>{userProfile?.displayName?.charAt(0) || 'G'}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}
