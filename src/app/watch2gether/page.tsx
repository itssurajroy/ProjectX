
'use client';

import { useState } from "react";
import { Loader2, PlusCircle, Users } from 'lucide-react';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { W2GRoomCard } from "@/components/watch2gether/W2GRoomCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCollection } from "@/firebase/firestore/useCollection";
import { WatchTogetherRoom } from "@/lib/types/watch2gether";
import { useUser } from "@/firebase/auth/use-user";
import toast from "react-hot-toast";

export default function Watch2GetherLobby() {
    const router = useRouter();
    const { user } = useUser();
    const [filter, setFilter] = useState('all');
    
    const { data: rooms, loading: isLoading, error } = useCollection<WatchTogetherRoom>('watch-together-rooms');

    const handleCreateRoom = () => {
        if (!user) {
            toast.error("You must be logged in to create a room.");
            router.push('/login');
            return;
        }
        // Redirect to a page or open a modal to select anime for the room
        // For simplicity, let's assume we're creating a room for a specific anime for now
        // This would be replaced with a proper creation flow.
        toast.error("Room creation is not fully implemented yet.");
    }
    
    const filteredRooms = (rooms || []).filter(room => {
        if (filter === 'all') return true;
        if (filter === 'live') return room.playerState.isPlaying;
        if (filter === 'waiting') return !room.playerState.isPlaying;
        return true;
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="w-8 h-8 text-primary"/> Watch Together</h1>
                    <p className="text-muted-foreground mt-1">Join a public room or create your own party.</p>
                </div>
                <Button onClick={handleCreateRoom}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create New Room
                </Button>
            </div>
            
             <Tabs value={filter} onValueChange={setFilter} className="mb-6">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="live">Live</TabsTrigger>
                    <TabsTrigger value="waiting">Waiting</TabsTrigger>
                </TabsList>
            </Tabs>
            
            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            )}

            {error && <ErrorDisplay title="Could not load rooms" description={error.message} />}

            {!isLoading && !error && filteredRooms.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredRooms.map(room => (
                        <W2GRoomCard key={room.id} room={room} />
                    ))}
                </div>
            )}

            {!isLoading && !error && filteredRooms.length === 0 && (
                <div className="text-center py-20 border border-dashed border-border rounded-lg">
                    <h3 className="text-xl font-semibold">No Rooms Available</h3>
                    <p className="text-muted-foreground mt-2">Why not be the first to create one?</p>
                </div>
            )}
        </div>
    );
}
