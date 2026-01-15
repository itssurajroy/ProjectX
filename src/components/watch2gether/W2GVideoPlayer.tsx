

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import AnimePlayer from '../AnimePlayer';
import { WatchTogetherRoom } from '@/lib/types/watch2gether';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useUser } from '@/firebase/auth/use-user';
import { db } from '@/firebase/client';
import toast from 'react-hot-toast';

interface W2GVideoPlayerProps {
    room: WatchTogetherRoom | null;
    isHost: boolean;
}

export default function W2GVideoPlayer({ room, isHost }: W2GVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user, userProfile } = useUser();
    
    // Simplified logic: The player is just a controlled component now.
    // Real-time sync would require a more robust solution (e.g. WebSockets or frequent Firestore updates)
    const onNextEpisode = useCallback(async () => {
        if (!isHost || !room) return;
        toast('Next episode functionality for Watch Together is coming soon!');
    }, [isHost, room]);


    if (!room) {
        return <div className="w-full aspect-video bg-black flex items-center justify-center"><p>Loading room details...</p></div>;
    }

    return (
        <div className="w-full aspect-video bg-black relative">
            <AnimePlayer 
                hianimeEpisodeId={room.episodeId} 
                animeId={room.animeId} 
                episodeId={room.episodeId}
                episodeNumber={String(room.episodeNumber)}
                onNext={onNextEpisode}
            />
             {!isHost && (
                <div className="absolute inset-0 bg-transparent z-10" title="Only the host can control the player" />
            )}
        </div>
    );
}
