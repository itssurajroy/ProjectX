// src/app/watch2gether/page.tsx
'use client';

import { useState } from "react";
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { WatchTogetherRoom } from '@/types/watch2gether';
import { Loader2, PlusCircle, Users } from 'lucide-react';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { W2GRoomCard } from "@/components/watch2gether/W2GRoomCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Watch2GetherLobby() {
    const firestore = useFirestore();
    const router = useRouter();
    const [filter, setFilter] = useState('all');

    const roomsRef = useMemoFirebase(() => collection(firestore, 'watch2gether_rooms'), [firestore]);
    const roomsQuery = useMemoFirebase(() => query(roomsRef, orderBy('createdAt', 'desc')), [roomsRef]);

    const { data: rooms, isLoading, error } = useCollection<WatchTogetherRoom>(roomsQuery);

    const filteredRooms = rooms?.filter(room => {
        if (filter === 'all') return true;
        // This is a placeholder logic for status. You'd need to define what "live", "waiting", "ended" means.
        // For now, let's assume isPlaying determines liveness.
        if (filter === 'live') return room.playerState.isPlaying;
        if (filter === 'waiting') return !room.playerState.isPlaying;
        if (filter === 'ended') return false; // Needs a way to determine when a room has ended
        return true;
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="w-8 h-8 text-primary"/> Watch Together</h1>
                    <p className="text-muted-foreground mt-1">Join a public room or create your own party.</p>
                </div>
                <Button asChild>
                    <Link href="/watch2gether/create">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create New Room
                    </Link>
                </Button>
            </div>
            
            <Tabs defaultValue="all" onValueChange={setFilter} className="mb-8">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="live">Live</TabsTrigger>
                    <TabsTrigger value="waiting">Waiting</TabsTrigger>
                    <TabsTrigger value="ended">Ended</TabsTrigger>
                </TabsList>
            </Tabs>

            {isLoading && (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-primary w-16 h-16" />
                </div>
            )}
            {error && <ErrorDisplay title="Could not load rooms" description={error.message} isCompact />}
            
            {filteredRooms && filteredRooms.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredRooms.map(room => (
                       <W2GRoomCard key={room.id} room={room} />
                    ))}
                </div>
            )}

            {!isLoading && (!filteredRooms || filteredRooms.length === 0) && (
                 <div className="text-center py-20">
                    <h3 className="text-xl font-semibold">No rooms found</h3>
                    <p className="text-muted-foreground mt-2">Why not be the first to create one?</p>
                </div>
            )}

            {/* Pagination could be added here if needed */}
        </div>
    );
}
