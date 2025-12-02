// src/components/watch2gether/W2GVideoPlayer.tsx
'use client';

import { DocumentData, DocumentReference, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import AnimePlayer from '../AnimePlayer';
import { WatchTogetherRoom } from '@/types/watch2gether';
import { useDoc } from '@/firebase';

interface W2GVideoPlayerProps {
    roomRef: DocumentReference<DocumentData>;
    isHost: boolean;
}

export default function W2GVideoPlayer({ roomRef, isHost }: W2GVideoPlayerProps) {
    const { data: room } = useDoc<WatchTogetherRoom>(roomRef);
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastUpdateTime = useRef(0);
    const isSeeking = useRef(false);

    const updateFirestoreState = async (newState: Partial<WatchTogetherRoom['playerState']>) => {
        if (!room) return;
        await updateDoc(roomRef, {
            playerState: {
                ...room.playerState,
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
        if (!video || isHost || !room) return;

        const firestoreTime = room.playerState.currentTime;
        const localTime = video.currentTime;
        const timeDiff = Math.abs(firestoreTime - localTime);

        // Sync time if difference is significant (e.g., > 2 seconds)
        if (timeDiff > 2) {
            video.currentTime = firestoreTime;
        }

        // Sync play/pause state
        if (room.playerState.isPlaying && video.paused) {
            video.play().catch(e => console.warn("Sync play failed", e));
        } else if (!room.playerState.isPlaying && !video.paused) {
            video.pause();
        }

    }, [room, isHost]);
    
    if (!room) {
        return <div className="w-full aspect-video bg-black flex items-center justify-center"><p>Loading player...</p></div>;
    }

    return (
        <div className="w-full aspect-video bg-black relative">
            {/* The AnimePlayer component needs to be adapted to accept a ref and forward it */}
            {/* For now, we'll simulate it. In a real scenario, you'd pass the ref to the underlying video element. */}
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
