// src/components/watch2gether/Watch2GetherClient.tsx
'use client';

import { useEffect } from 'react';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import { useUser, useFirestore, useMemoFirebase, useDoc, useCollection, setDocumentNonBlocking } from '@/firebase';
import { Loader2, Users, Crown, Settings, Share2, LogOut } from 'lucide-react';
import ErrorDisplay from '../common/ErrorDisplay';
import W2GVideoPlayer from './W2GVideoPlayer';
import W2GChat from './W2GChat';
import { RoomUser, WatchTogetherRoom } from '@/types/watch2gether';
import W2GUserList from './W2GUserList';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Watch2GetherClient({ roomId }: { roomId: string }) {
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();

    const roomRef = useMemoFirebase(() => doc(firestore, 'watch2gether_rooms', roomId), [firestore, roomId]);
    const usersRef = useMemoFirebase(() => collection(firestore, 'watch2gether_rooms', roomId, 'users'), [firestore, roomId]);

    const { data: roomData, isLoading: isRoomLoading, error: roomError } = useDoc<WatchTogetherRoom>(roomRef);
    const { data: usersInRoom, isLoading: isUsersLoading, error: usersError } = useCollection<RoomUser>(usersRef);

    useEffect(() => {
        if (!user || !roomData) return;

        const userDocRef = doc(usersRef, user.uid);
        const userData = {
            id: user.uid,
            name: user.displayName || `Guest#${user.uid.slice(0, 4)}`,
            avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
            isHost: roomData.hostId === user.uid
        };
        
        setDocumentNonBlocking(userDocRef, userData, { merge: true });

        // Optional: Implement `onDisconnect` to remove the user
        // This is more complex and requires Realtime Database or Cloud Functions
        // onDisconnect(ref(db, `status/${user.uid}`)).set('offline');

    }, [user, roomData, usersRef]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Room link copied to clipboard!");
    }

    const handleLeave = () => {
        router.push('/home');
    }
    
    if (isRoomLoading || isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="ml-4 text-lg">Joining Watch Party...</p>
            </div>
        );
    }

    if (roomError) return <ErrorDisplay title="Error loading room" description={roomError.message} />;
    if (!roomData) return <ErrorDisplay title="Room not found" description="This watch party does not exist or has expired." />;
    if (usersError) return <ErrorDisplay title="Error loading users" description={usersError.message} />;

    const isHost = user?.uid === roomData.hostId;

    return (
        <div className="flex h-screen bg-background text-foreground">
            <main className="flex-1 flex flex-col bg-black">
                <div className="flex-1 w-full h-full flex items-center justify-center">
                    <W2GVideoPlayer
                        roomRef={roomRef!}
                        isHost={isHost}
                    />
                </div>
                 <div className="bg-card/50 p-3 border-y border-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className='flex items-center gap-3'>
                        {roomData.animePoster && <Image src={roomData.animePoster} alt={roomData.animeName || 'Anime Poster'} width={40} height={60} className="rounded-md" />}
                        <div>
                            <h1 className="text-xl font-bold leading-tight">{roomData.name}</h1>
                            <p className="text-sm text-muted-foreground">Watching: {roomData.animeName} - Episode {roomData.episodeNumber}</p>
                        </div>
                    </div>
                     <div className='flex items-center gap-2'>
                        <Button onClick={handleShare} variant="secondary" size="sm" className="gap-2"><Share2 className="w-4 h-4"/> Share</Button>
                        {isHost && <Button variant="secondary" size="sm" className="gap-2"><Settings className="w-4 h-4"/> Settings</Button>}
                         <Button onClick={handleLeave} variant="destructive" size="sm" className="gap-2"><LogOut className="w-4 h-4"/> Leave</Button>
                    </div>
                </div>
            </main>
            <aside className="w-80 bg-card/30 border-l border-border/50 flex flex-col">
                <div className="p-4 border-b border-border/50">
                    <h2 className="font-bold flex items-center gap-2"><Users className="w-5 h-5"/> Participants ({usersInRoom?.length || 0})</h2>
                    { isUsersLoading ? <Loader2 className="w-5 h-5 animate-spin my-4 mx-auto" /> :
                     <W2GUserList users={usersInRoom || []} hostId={roomData.hostId} /> }
                </div>
                <W2GChat roomId={roomId} />
            </aside>
        </div>
    );
}
