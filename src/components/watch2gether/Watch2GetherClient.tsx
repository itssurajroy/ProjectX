
// src/components/watch2gether/Watch2GetherClient.tsx
'use client';

import { useEffect } from 'react';
import { doc, collection, setDoc } from 'firebase/firestore';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { Loader2, Users, Crown, Settings, Share2, LogOut } from 'lucide-react';
import ErrorDisplay from '../common/ErrorDisplay';
import W2GVideoPlayer from './W2GVideoPlayer';
import W2GChat from './W2GChat';
import { WatchTogetherRoom } from '@/types/watch2gether';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { AnimeAboutResponse, AnimeInfo } from '@/types/anime';
import Image from 'next/image';
import Synopsis from '../anime/Synopsis';
import { Badge } from '../ui/badge';
import { Clapperboard } from 'lucide-react';
import Link from 'next/link';
import SiteLogo from '../layout/SiteLogo';

const W2GAnimeDetails = ({ animeInfo, moreInfo }: { animeInfo: AnimeInfo, moreInfo: any }) => {
    const stats = animeInfo.stats;
    return (
        <div className='p-4 md:p-6'>
             <h1 className="text-title font-bold text-glow">{animeInfo.name}</h1>
              
              <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mt-4">
                  {stats.rating && stats.rating !== 'N/A' && <Badge variant={stats.rating === 'R' ? 'destructive' : 'secondary'} className="px-2 py-1">{stats.rating}</Badge>}
                  <span className="px-2 py-1 bg-card/50 rounded-md border border-border/50">{stats.quality}</span>
                  {stats.episodes.sub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-card/50 rounded-md border border-border/50">
                          <Clapperboard className="w-3 h-3" /> SUB {stats.episodes.sub}
                      </span>
                  )}
                  {stats.episodes.dub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">
                         DUB {stats.episodes.dub}
                      </span>
                  )}
                  <span className="text-sm text-muted-foreground">&bull; {stats.type} &bull; {stats.duration}</span>
              </div>

              <div className="mt-6 max-w-3xl">
                <Synopsis description={animeInfo.description} />
              </div>
               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                 {Object.entries(moreInfo).map(([key, value]) => {
                       if (!value || (Array.isArray(value) && value.length === 0)) return null;
                       const label = key.charAt(0).toUpperCase() + key.slice(1);
                       
                       return (
                         <div key={key} className="flex justify-between border-b border-border/50 pb-2 last:border-b-0">
                            <span className="font-bold text-foreground/80">{label}:</span>
                            {key === 'genres' && Array.isArray(value) ? (
                                <div className="flex flex-wrap items-center justify-end gap-1 max-w-[60%]">
                                    {value.map((genre: string) => (
                                        <Link key={genre} href={`/search?genres=${genre.toLowerCase().replace(/ /g, '-')}`} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-md hover:text-primary hover:bg-muted">{genre}</Link>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted-foreground text-right">{Array.isArray(value) ? value.join(', ') : value}</span>
                            )}
                         </div>
                       )
                    })}
                </div>
        </div>
    )
}


export default function Watch2GetherClient({ roomId }: { roomId: string }) {
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();

    const roomRef = useMemoFirebase(() => doc(firestore, 'watch2gether_rooms', roomId), [firestore, roomId]);

    const { data: roomData, isLoading: isRoomLoading, error: roomError } = useDoc<WatchTogetherRoom>(roomRef);
    
    const { data: animeResult, isLoading: isAnimeLoading } = useQuery<AnimeAboutResponse>({
        queryKey: ['anime', roomData?.animeId],
        queryFn: () => AnimeService.anime(roomData!.animeId),
        enabled: !!roomData?.animeId,
    });


    useEffect(() => {
        if (!user || !roomData) return;

        const userDocRef = doc(collection(firestore, 'watch2gether_rooms', roomId, 'users'), user.uid);
        
        const userData = {
            id: user.uid,
            name: user.displayName || `Guest#${user.uid.slice(0, 4)}`,
            avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
            isHost: roomData.hostId === user.uid
        };
        
        setDoc(userDocRef, userData, { merge: true }).catch(e => console.error("Failed to set user in room", e));

    }, [user, roomData, roomId, firestore]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Room link copied to clipboard!");
    }
    
    if (isRoomLoading || isUserLoading || isAnimeLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="ml-4 text-lg">Joining Watch Party...</p>
            </div>
        );
    }

    if (roomError) return <ErrorDisplay title="Error loading room" description={roomError.message} />;
    if (!roomData) return <ErrorDisplay title="Room not found" description="This watch party does not exist or has expired." />;
    
    const isHost = user?.uid === roomData.hostId;
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
                    roomRef={roomRef!}
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
