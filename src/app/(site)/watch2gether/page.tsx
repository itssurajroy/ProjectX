

'use client';

import { useState, FormEvent, useEffect } from "react";
import { Loader2, PlusCircle, Users, Search } from 'lucide-react';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { W2GRoomCard } from "@/components/watch2gether/W2GRoomCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { WatchTogetherRoom } from "@/lib/types/watch2gether";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AnimeService } from '@/lib/services/AnimeService';
import { SearchResult, AnimeBase } from "@/lib/types/anime";
import { Input } from "@/components/ui/input";
import { AnimeCard } from "@/components/AnimeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "use-debounce";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CreateRoomModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { user, userProfile } = useUser();
    const router = useRouter();
    const firestore = useFirestore();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 500);
    const [selectedAnime, setSelectedAnime] = useState<AnimeBase | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const { data: searchResults, isLoading: isSearchLoading } = useInfiniteQuery({
        queryKey: ['w2g-anime-search', debouncedQuery],
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            const params = new URLSearchParams({ q: debouncedQuery, limit: '12', page: String(pageParam) });
            return AnimeService.search(params);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.data.hasNextPage ? lastPage.data.currentPage + 1 : undefined,
        enabled: !!debouncedQuery && !selectedAnime,
    });
    
    const { data: episodesData, isLoading: isEpisodesLoading } = useQuery({
        queryKey: ['episodes', selectedAnime?.id],
        queryFn: () => AnimeService.episodes(selectedAnime!.id),
        enabled: !!selectedAnime,
    });
    
    const animes = searchResults?.pages.flatMap(page => page.data.animes) ?? [];

    const handleCreateRoom = async () => {
        if (!user || !userProfile || !selectedAnime || !episodesData?.episodes?.[0]) {
            toast.error("Please select an anime with available episodes.");
            return;
        }
        
        setIsCreating(true);
        const toastId = toast.loading("Creating your room...");
        
        try {
            const firstEpisode = episodesData.episodes[0];
            const firstEpisodeId = firstEpisode.episodeId.split('?ep=')[0];

            const roomData: Omit<WatchTogetherRoom, 'id'> = {
                name: `${userProfile.displayName}'s Room`,
                animeId: selectedAnime.id,
                animeName: selectedAnime.name,
                animePoster: selectedAnime.poster,
                episodeId: firstEpisode.episodeId,
                episodeNumber: firstEpisode.number,
                hostId: user.uid,
                createdAt: serverTimestamp(),
                playerState: {
                    isPlaying: false,
                    currentTime: 0,
                    updatedAt: serverTimestamp(),
                },
                users: [user.uid],
                userProfiles: {
                  [user.uid]: {
                    id: user.uid,
                    name: userProfile.displayName,
                    avatar: userProfile.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
                    isHost: true,
                  }
                }
            };
            
            const docRef = await addDoc(collection(firestore, 'watch-together-rooms'), roomData);
            toast.success("Room created!", { id: toastId });
            router.push(`/watch2gether/${docRef.id}`);

        } catch (error) {
            console.error("Error creating room:", error);
            toast.error("Failed to create room.", { id: toastId });
        } finally {
            setIsCreating(false);
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create a Watch Party Room</DialogTitle>
                    <DialogDescription>Select an anime to start your watch party.</DialogDescription>
                </DialogHeader>

                {!selectedAnime ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for an anime..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <ScrollArea className="h-96">
                            {isSearchLoading && animes.length === 0 && <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {animes.map(anime => (
                                    <div key={anime.id} onClick={() => setSelectedAnime(anime)} className="cursor-pointer">
                                        <AnimeCard anime={anime} />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-1/4">
                                <AnimeCard anime={selectedAnime} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold">{selectedAnime.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedAnime.type} &bull; {episodesData?.episodes.length || '...'} Episodes</p>
                                <div className="mt-4 flex gap-2">
                                     <Button onClick={handleCreateRoom} disabled={isEpisodesLoading || isCreating}>
                                        {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <PlusCircle className="w-4 h-4 mr-2"/>}
                                        Create Room
                                    </Button>
                                    <Button variant="outline" onClick={() => setSelectedAnime(null)}>Back to Search</Button>
                                </div>
                                {isEpisodesLoading && <p className="text-sm text-muted-foreground mt-2">Loading episode data...</p>}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default function Watch2GetherLobby() {
    const router = useRouter();
    const { user } = useUser();
    const [filter, setFilter] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const { data: rooms, loading: isLoading, error } = useCollection<WatchTogetherRoom>('watch-together-rooms');

    const handleCreateRoomClick = () => {
        if (!user) {
            toast.error("You must be logged in to create a room.");
            router.push('/login');
            return;
        }
        setIsCreateModalOpen(true);
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
                <Button onClick={handleCreateRoomClick}>
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

            <CreateRoomModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
}
