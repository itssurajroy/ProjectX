
// src/components/watch2gether/W2GVideoPlayer.tsx
'use client';

import { DocumentReference, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import AnimePlayer from '../AnimePlayer';
import { WatchTogetherRoom } from '@/types/watch2gether';

interface W2GVideoPlayerProps {
    roomRef: DocumentReference;
    animeId: string;
    episodeId: string;
    playerState: WatchTogetherRoom['playerState'];
    isHost: boolean;
}

export default function W2GVideoPlayer({ roomRef, animeId, episodeId, playerState, isHost }: W2GVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastUpdateTime = useRef(0);
    const isSeeking = useRef(false);

    const updateFirestoreState = async (newState: Partial<WatchTogetherRoom['playerState']>) => {
        await updateDoc(roomRef, {
            playerState: {
                ...playerState,
                ...newState,
                updatedAt: serverTimestamp(),
            },
        });
    };

    // Host controls
    const handlePlay = () => isHost && updateFirestoreState({ isPlaying: true });
    const handlePause = () => isHost && updateFirestoreState({ isPlaying: false });
    const handleSeek = () => {
        if (isHost && videoRef.current) {
            isSeeking.current = false;
            updateFirestoreState({ currentTime: videoRef.current.currentTime });
        }
    };
    const handleSeeking = () => {
        if(isHost) isSeeking.current = true;
    }

    // Sync from Firestore for non-hosts
    useEffect(() => {
        const video = videoRef.current;
        if (!video || isHost) return;

        const firestoreTime = playerState.currentTime;
        const localTime = video.currentTime;
        const timeDiff = Math.abs(firestoreTime - localTime);

        // Sync time if difference is significant (e.g., > 2 seconds)
        if (timeDiff > 2) {
            video.currentTime = firestoreTime;
        }

        // Sync play/pause state
        if (playerState.isPlaying && video.paused) {
            video.play().catch(e => console.warn("Sync play failed", e));
        } else if (!playerState.isPlaying && !video.paused) {
            video.pause();
        }

    }, [playerState, isHost]);
    
    return (
        <div className="w-full aspect-video bg-black relative">
            {/* The AnimePlayer component needs to be adapted to accept a ref and forward it */}
            {/* For now, we'll simulate it. In a real scenario, you'd pass the ref to the underlying video element. */}
            <AnimePlayer animeId={animeId} episodeId={episodeId} onNext={() => {}} />

             {!isHost && (
                <div className="absolute inset-0 bg-transparent z-10" title="Only the host can control the player" />
            )}
        </div>
    );
}
