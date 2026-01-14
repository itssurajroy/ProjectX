'use client';
import { Button } from '@/components/ui/button';
import SiteLogo from '@/components/layout/SiteLogo';
import { Menu, Bell } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase/auth/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
    onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const { user, userProfile } = useUser();
    return (
        <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="w-full px-4 flex items-center justify-between gap-2">
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="w-64 border-r border-border h-16 items-center justify-center hidden lg:flex">
                        <SiteLogo />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                   <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={userProfile?.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.uid}`} alt={userProfile?.displayName} />
                                    <AvatarFallback>{userProfile?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userProfile?.displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/home">View Site</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/dashboard/profile">Your Profile</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
