// src/components/watch2gether/W2GVideoPlayer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import AnimePlayer from '../AnimePlayer';

interface W2GVideoPlayerProps {
    roomRef: any; // DocumentReference<DocumentData>; - Type removed as Firebase is gone
    isHost: boolean;
}

export default function W2GVideoPlayer({ roomRef, isHost }: W2GVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // This component is now disconnected from Firebase.
    // The logic below is placeholder and would need to be adapted
    // to a new backend service (e.g. WebSockets) if one is implemented.
    const room = null as any;

    if (!room) {
        return <div className="w-full aspect-video bg-black flex items-center justify-center"><p>Watch Together is offline.</p></div>;
    }

    return (
        <div className="w-full aspect-video bg-black relative">
            <AnimePlayer 
                animeId={room.animeId} 
                episodeId={room.episodeId} 
                onNext={() => {
                    // In the future, this would advance the episode for the whole room
                }}
            />
             {!isHost && (
                <div className="absolute inset-0 bg-transparent z-10" title="Only the host can control the player" />
            )}
        </div>
    );
}
