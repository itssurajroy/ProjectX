// src/app/watch2gether/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initializeFirebase, addDocumentNonBlocking, FirestorePermissionError, errorEmitter } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import type { SecurityRuleContext } from "@/firebase/errors";

export default function Watch2GetherLobby() {
    const router = useRouter();
    const [roomName, setRoomName] = useState('');
    const [animeId, setAnimeId] = useState('one-piece-100'); // Default for demo
    const [episodeNumber, setEpisodeNumber] = useState(1);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateRoom = async () => {
        if (!roomName.trim() || !animeId.trim()) {
            toast.error("Please enter a room name and select an anime.");
            return;
        }

        setIsCreating(true);
        try {
            const { firestore, auth } = initializeFirebase();
            if (!auth.currentUser) {
                toast.error("You must be logged in to create a room.");
                // In a real app, you'd probably prompt for anonymous sign-in here
                setIsCreating(false);
                return;
            }

            const roomCollection = collection(firestore, 'watch2gether_rooms');
            const roomData = {
                name: roomName,
                animeId: animeId,
                episodeId: `${animeId}?ep=${episodeNumber}`,
                episodeNumber: episodeNumber,
                hostId: auth.currentUser.uid,
                createdAt: serverTimestamp(),
                playerState: {
                    isPlaying: false,
                    currentTime: 0,
                    updatedAt: serverTimestamp(),
                }
            };
            
            addDoc(roomCollection, roomData).then(newRoomDoc => {
                 toast.success("Room created successfully!");
                 router.push(`/watch2gether/${newRoomDoc.id}`);
            }).catch(serverError => {
                const permissionError = new FirestorePermissionError({
                    path: roomCollection.path,
                    operation: 'create',
                    requestResourceData: roomData
                } satisfies SecurityRuleContext);
                errorEmitter.emit('permission-error', permissionError);
                setIsCreating(false);
            });

        } catch (error) {
            console.error("Error creating room:", error);
            toast.error("Failed to create room. Please try again.");
            setIsCreating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-glow">Watch Together</h1>
                <p className="text-lg text-muted-foreground mt-2">Create a room and watch anime with your friends, synced in real-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle>Create a New Room</CardTitle>
                        <CardDescription>Fill in the details to start a new watching party.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input 
                            placeholder="Room Name" 
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                        <Input 
                            placeholder="Anime ID (e.g., one-piece-100)" 
                             value={animeId}
                            onChange={(e) => setAnimeId(e.target.value)}
                        />
                        <Input 
                            type="number"
                            placeholder="Episode Number" 
                            value={episodeNumber}
                            onChange={(e) => setEpisodeNumber(Number(e.target.value))}
                        />
                        <Button onClick={handleCreateRoom} disabled={isCreating} className="w-full">
                            {isCreating ? "Creating..." : "Create Room"}
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                     <CardHeader>
                        <CardTitle>Public Rooms</CardTitle>
                        <CardDescription>Join a room that is already active.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-10 text-muted-foreground">
                            <p>No public rooms available right now.</p>
                            <p className="text-sm">Why not create one?</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
