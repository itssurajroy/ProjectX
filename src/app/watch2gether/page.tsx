// src/app/watch2gether/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/AnimeService";
import { SearchSuggestion, AnimeEpisode } from "@/types/anime";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

function SearchResultItem({ anime, onSelect }: { anime: SearchSuggestion, onSelect: (anime: SearchSuggestion) => void }) {
    return (
        <div onClick={() => onSelect(anime)} className="flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors cursor-pointer rounded-md">
            <div className="relative w-12 h-[72px] flex-shrink-0">
                <Image src={anime.poster} alt={anime.name} fill sizes="48px" className="rounded-md object-cover" />
            </div>
            <div className='overflow-hidden'>
                <p className="font-semibold truncate text-sm">{anime.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                    {anime.moreInfo.map(info => <span key={info}>{info}</span>)}
                </div>
            </div>
        </div>
    );
}

export default function Watch2GetherLobby() {
    const router = useRouter();
    const firestore = useFirestore();
    const { user } = useUser();

    const [roomName, setRoomName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAnime, setSelectedAnime] = useState<SearchSuggestion | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

    const { data: searchResults, isLoading: isSearchLoading } = useQuery({
        queryKey: ['w2g-search', debouncedSearchQuery],
        queryFn: () => AnimeService.getSearchSuggestions(debouncedSearchQuery),
        enabled: debouncedSearchQuery.length > 2,
    });

    const { data: episodesData, isLoading: isEpisodesLoading } = useQuery<{ episodes: AnimeEpisode[] }>({
        queryKey: ['episodes', selectedAnime?.id],
        queryFn: () => AnimeService.episodes(selectedAnime!.id),
        enabled: !!selectedAnime,
    });
    const episodes = useMemo(() => episodesData?.episodes || [], [episodesData]);

    const handleSelectAnime = (anime: SearchSuggestion) => {
        setSelectedAnime(anime);
        setSearchQuery(''); // Clear search to hide results
    };

    const handleCreateRoom = async () => {
        if (!roomName.trim()) return toast.error("Please enter a room name.");
        if (!selectedAnime) return toast.error("Please select an anime.");
        if (!selectedEpisode) return toast.error("Please select an episode.");
        
        if (!user) {
            toast.error("You must be logged in to create a room.");
            router.push('/login');
            return;
        }

        setIsCreating(true);
        const toastId = toast.loading('Creating your watch party...');

        const roomCollection = collection(firestore, 'watch2gether_rooms');
        const roomData = {
            name: roomName,
            animeId: selectedAnime.id,
            animeName: selectedAnime.name,
            animePoster: selectedAnime.poster,
            episodeId: `${selectedAnime.id}?ep=${selectedEpisode}`,
            episodeNumber: Number(selectedEpisode),
            hostId: user.uid,
            createdAt: serverTimestamp(),
            playerState: {
                isPlaying: false,
                currentTime: 0,
                updatedAt: serverTimestamp(),
            }
        };

        try {
            const newRoomDoc = await addDoc(roomCollection, roomData);
            toast.success("Room created! Let the party begin.", { id: toastId });
            router.push(`/watch2gether/${newRoomDoc.id}`);
        } catch (error) {
            console.error("Error creating room:", error);
            toast.error("Failed to create room. Please try again.", { id: toastId });
            setIsCreating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 max-w-4xl">
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
                        
                        <div className="relative">
                            <Input
                                placeholder="Search for an anime..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if(selectedAnime) setSelectedAnime(null);
                                    if(selectedEpisode) setSelectedEpisode(null);
                                }}
                            />
                            {isSearchLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" />}
                            
                            {searchResults?.suggestions && searchQuery.length > 0 && (
                                <ScrollArea className="absolute top-full mt-1 w-full bg-card border border-border rounded-md shadow-lg z-10 max-h-72">
                                    <div className="p-2">
                                    {searchResults.suggestions.map(anime => (
                                        <SearchResultItem key={anime.id} anime={anime} onSelect={handleSelectAnime} />
                                    ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>

                        {selectedAnime && (
                             <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-md border border-border">
                                <Image src={selectedAnime.poster} alt={selectedAnime.name} width={40} height={60} className="rounded-md" />
                                <div className="overflow-hidden">
                                     <p className="font-semibold truncate">{selectedAnime.name}</p>
                                     <p className="text-xs text-muted-foreground">Anime selected</p>
                                </div>
                             </div>
                        )}

                        <Select onValueChange={setSelectedEpisode} disabled={!selectedAnime || isEpisodesLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder={isEpisodesLoading ? "Loading episodes..." : "Select an episode"} />
                            </SelectTrigger>
                            <SelectContent>
                                {episodes.map(ep => (
                                    <SelectItem key={ep.number} value={String(ep.number)}>
                                        Ep {ep.number}: {ep.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={handleCreateRoom} disabled={isCreating} className="w-full">
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
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
