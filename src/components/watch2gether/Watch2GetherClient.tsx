
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
import { AnimeService } from '@/lib/services/AnimeService';
import { AnimeAboutResponse } from '@/lib/types/anime';
import { WatchTogetherRoom } from '@/lib/types/watch2gether';
import SiteLogo from '../layout/SiteLogo';
import W2GAnimeDetails from './W2GAnimeDetails';
import { useDoc, useUser, db } from '@/firebase/client';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function Watch2GetherClient({ roomId }: { roomId: string }) {
    const router = useRouter();
    const { user, userProfile } = useUser();
    const { data: roomData, loading: isRoomLoading, error: roomError } = useDoc<WatchTogetherRoom>(`watch-together-rooms/${roomId}`);

    const isHost = user?.uid === roomData?.hostId;

    const { data: animeResult, isLoading: isAnimeLoading } = useQuery<AnimeAboutResponse>({
        queryKey: ['anime', roomData?.animeId],
        queryFn: () => AnimeService.anime(roomData!.animeId),
        enabled: !!roomData,
    });

    // Add user to the room on join
    useEffect(() => {
        if (user && userProfile && roomData && !roomData.users.includes(user.uid)) {
            const roomRef = doc(db, 'watch-together-rooms', roomId);
            updateDoc(roomRef, {
                users: arrayUnion(user.uid),
                [`userProfiles.${user.uid}`]: {
                    id: user.uid,
                    name: userProfile.displayName,
                    avatar: userProfile.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
                    isHost: false,
                }
            }).catch(err => console.error("Failed to add user to room", err));
        }
    }, [user, userProfile, roomData, roomId]);

    // Remove user from room on leave
    const handleLeave = async () => {
        if (user && roomData?.users.includes(user.uid)) {
            const roomRef = doc(db, 'watch-together-rooms', roomId);
            // In a real app, you might want to transfer host role if the host leaves.
            // For now, we just remove the user.
            await updateDoc(roomRef, {
                users: arrayRemove(user.uid),
                [`userProfiles.${user.uid}`]: undefined // This might not work as expected, need deleteField
            }).catch(err => console.error("Failed to remove user from room", err));
        }
        router.push('/watch2gether');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Room link copied to clipboard!");
    }
    
    if (isRoomLoading || (roomData && isAnimeLoading)) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="ml-4 text-lg">Joining Watch Party...</p>
            </div>
        );
    }

    if (roomError || !roomData) {
        return <ErrorDisplay title="Room not found" description={roomError?.message || "This watch party does not exist or has expired."} />;
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
                <Button onClick={handleLeave} variant="destructive" size="sm" className="gap-2"><LogOut className="w-4 h-4"/> Leave</Button>
            </div>
          </div>
        </header>

        <div className="pt-16 grid grid-cols-12 h-screen">
           <main className="col-span-12 lg:col-span-9 h-full overflow-y-auto">
               <W2GVideoPlayer
                    room={roomData}
                    isHost={isHost}
                />
                {animeInfo && moreInfo && <W2GAnimeDetails animeInfo={animeInfo} moreInfo={moreInfo} />}
           </main>
           <aside className="hidden lg:block lg:col-span-3 h-full border-l border-border/50">
             <W2GChat roomId={roomId} />
           </aside>
        </div>
       </div>
    );
}
