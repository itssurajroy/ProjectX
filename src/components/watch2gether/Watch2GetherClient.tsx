
'use client';

import { useEffect } from 'react';
import { Loader2, Users, Crown, Settings, Share2, LogOut } from 'lucide-react';
import ErrorDisplay from '../common/ErrorDisplay';
import W2GVideoPlayer from './W2GVideoPlayer';
import W2GChat from './W2GChat';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { AnimeAboutResponse, AnimeInfo } from '@/types/anime';
import Link from 'next/link';
import SiteLogo from '../layout/SiteLogo';
import W2GAnimeDetails from './W2GAnimeDetails';

export default function Watch2GetherClient({ roomId }: { roomId: string }) {
    const router = useRouter();

    // This component is now disconnected from any backend database.
    // The logic below is placeholder and would need to be adapted
    // to a new backend service (e.g., WebSockets) if one is implemented.
    const isRoomLoading = false;
    const roomError = { message: "Watch Together is temporarily offline." };
    const roomData = null as any;
    const isHost = false;
    const animeResult = null as any;
    const isAnimeLoading = false;

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Room link copied to clipboard!");
    }
    
    if (isRoomLoading || isAnimeLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="ml-4 text-lg">Joining Watch Party...</p>
            </div>
        );
    }

    if (roomError || !roomData) {
        return <ErrorDisplay title="Room not found" description="This watch party does not exist, has expired, or is currently unavailable." />;
    }
    
    const animeInfo = animeResult?.anime?.info;
    const moreInfo = animeResult?.anime?.moreInfo;

    return (
       <div className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center bg-background/90 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <SiteLogo />
            <div className='flex items-center gap-2'>
                <Button onClick={handleShare} variant="secondary" size="sm" className="gap-2"><Share2 className="w-4 h-4"/> Share</Button>
                {isHost && <Button variant="secondary" size="sm" className="gap-2"><Settings className="w-4 h-4"/> Settings</Button>}
                <Button onClick={() => router.push('/home')} variant="destructive" size="sm" className="gap-2"><LogOut className="w-4 h-4"/> Leave</Button>
            </div>
          </div>
        </header>

        <div className="pt-16 grid grid-cols-12 h-screen">
           <main className="col-span-9 h-full overflow-y-auto">
               <W2GVideoPlayer
                    roomRef={null}
                    isHost={isHost}
                />
                {animeInfo && moreInfo && <W2GAnimeDetails animeInfo={animeInfo} moreInfo={moreInfo} />}
           </main>
           <aside className="col-span-3 h-full border-l border-border/50">
             <W2GChat roomId={roomId} />
           </aside>
        </div>
       </div>
    );
}
