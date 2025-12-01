// src/components/watch2gether/Watch2GetherClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import { doc, collection, DocumentData, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { Loader2, Users } from 'lucide-react';
import ErrorDisplay from '../common/ErrorDisplay';
import W2GVideoPlayer from './W2GVideoPlayer';
import W2GChat from './W2GChat';
import { RoomUser, WatchTogetherRoom } from '@/types/watch2gether';
import W2GUserList from './W2GUserList';

export default function Watch2GetherClient({ roomId }: { roomId: string }) {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();

    // Memoize Firestore references
    const roomRef = useMemoFirebase(() => doc(firestore, 'watch2gether_rooms', roomId), [firestore, roomId]);
    const usersRef = useMemoFirebase(() => collection(firestore, 'watch2gether_rooms', roomId, 'users'), [firestore, roomId]);

    const [roomData, isRoomLoading, roomError] = useDocumentData<WatchTogetherRoom>(roomRef);
    const [usersInRoom, isUsersLoading, usersError] = useCollectionData<RoomUser>(usersRef);

    useEffect(() => {
        if (!user || !roomData) return;

        // Add user to the room's `users` subcollection
        const userDocRef = doc(usersRef, user.uid);
        setDoc(userDocRef, {
            id: user.uid,
            name: user.displayName || 'Anonymous',
            avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
            isHost: roomData.hostId === user.uid
        }, { merge: true });

    }, [user, roomData, usersRef]);
    
    if (isRoomLoading || isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="ml-4 text-lg">Joining room...</p>
            </div>
        );
    }

    if (roomError) {
        return <ErrorDisplay title="Error loading room" description={roomError.message} />;
    }

    if (!roomData) {
        return <ErrorDisplay title="Room not found" description="This room does not exist or has expired." />;
    }

    return (
        <div className="flex h-screen bg-black text-white">
            <main className="flex-1 flex flex-col">
                <div className="flex-1 bg-black flex items-center justify-center">
                    <W2GVideoPlayer
                        roomRef={roomRef}
                        animeId={roomData.animeId}
                        episodeId={roomData.episodeId}
                        playerState={roomData.playerState}
                        isHost={user?.uid === roomData.hostId}
                    />
                </div>
                 <div className="bg-card/50 p-3 border-t border-border/50">
                    <h1 className="text-xl font-bold">{roomData.name}</h1>
                    <p className="text-sm text-muted-foreground">Watching {roomData.animeId} - Episode {roomData.episodeNumber}</p>
                </div>
            </main>
            <aside className="w-80 bg-card/30 border-l border-border/50 flex flex-col">
                <div className="p-4 border-b border-border/50">
                    <h2 className="font-bold flex items-center gap-2"><Users className="w-5 h-5"/> Participants ({usersInRoom?.length || 0})</h2>
                    <W2GUserList users={usersInRoom || []} hostId={roomData.hostId} />
                </div>
                <W2GChat roomId={roomId} />
            </aside>
        </div>
    );
}
