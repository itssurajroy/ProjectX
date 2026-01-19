
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDoc, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, TrendingUp, Sparkles, PlusCircle, Trash2, ArrowUp, ArrowDown, Search } from "lucide-react";
import { AnimeBase, SearchSuggestion } from "@/lib/types/anime";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/services/AnimeService";
import ProgressiveImage from "@/components/ProgressiveImage";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "use-debounce";

interface HomepageSettings {
    spotlightAnimeIds?: string[];
}

interface SpotlightAnime extends AnimeBase {
    // an id is already in AnimeBase
}

// --- AddSpotlightDialog ---
const AddSpotlightDialog = ({ onAdd }: { onAdd: (anime: SearchSuggestion) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    
    const { data: searchResults, isLoading } = useQuery({
        queryKey: ['spotlight-search', debouncedQuery],
        queryFn: () => AnimeService.getSearchSuggestions(debouncedQuery),
        enabled: debouncedQuery.length > 2,
    });

    const handleSelect = (anime: SearchSuggestion) => {
        onAdd(anime);
        setIsOpen(false);
        setSearchQuery('');
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><PlusCircle className="w-4 h-4"/> Add Anime</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Anime to Spotlight</DialogTitle>
                    <DialogDescription>Search for an anime to feature on the homepage.</DialogDescription>
                </DialogHeader>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search for an anime..." 
                        className="pl-10" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <ScrollArea className="h-96">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>
                    ) : searchResults?.suggestions?.length > 0 ? (
                         <div className="space-y-2">
                             {searchResults.suggestions.map((anime: SearchSuggestion) => (
                                 <div key={anime.id} onClick={() => handleSelect(anime)} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                                     <div className="relative w-12 h-16 flex-shrink-0">
                                         <ProgressiveImage src={anime.poster} alt={anime.name} fill className="object-cover rounded-md" />
                                     </div>
                                     <div className="overflow-hidden">
                                         <p className="font-semibold text-sm truncate">{anime.name}</p>
                                         <p className="text-xs text-muted-foreground">{anime.moreInfo.join(' • ')}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    ) : (
                         <p className="text-center text-muted-foreground pt-10">
                            {debouncedQuery.length > 2 ? 'No results found.' : 'Type to search...'}
                         </p>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}


// --- Main Component ---
export default function AdminTrendingPage() {
    const firestore = useFirestore();
    const { data: homepageSettings, loading: loadingSettings } = useDoc<HomepageSettings>('settings/homepage');
    const [spotlightAnimes, setSpotlightAnimes] = useState<SpotlightAnime[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);

    useEffect(() => {
        if (homepageSettings?.spotlightAnimeIds) {
            setIsFetchingDetails(true);
            const fetchDetails = async () => {
                const animeDetailsPromises = homepageSettings.spotlightAnimeIds!.map(id => AnimeService.qtip(id).catch(() => null));
                const results = await Promise.all(animeDetailsPromises);
                const detailedAnimes = results
                    .filter(res => res && res.anime)
                    .map(res => res.anime as SpotlightAnime);
                setSpotlightAnimes(detailedAnimes);
                setIsFetchingDetails(false);
            };
            fetchDetails();
        }
    }, [homepageSettings]);
    
    const handleAddAnime = (anime: SearchSuggestion) => {
        if(spotlightAnimes.some(a => a.id === anime.id)) {
            toast.error(`${anime.name} is already in the spotlight.`);
            return;
        }
        setSpotlightAnimes(prev => [...prev, anime as SpotlightAnime]);
        toast.success(`${anime.name} added to spotlight list.`);
    }

    const handleRemoveAnime = (animeId: string) => {
        setSpotlightAnimes(prev => prev.filter(a => a.id !== animeId));
    }
    
    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= spotlightAnimes.length) return;

        const newAnimes = [...spotlightAnimes];
        const temp = newAnimes[index];
        newAnimes[index] = newAnimes[newIndex];
        newAnimes[newIndex] = temp;
        setSpotlightAnimes(newAnimes);
    }

    const handleSaveChanges = () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving spotlight configuration...");
        const settingsRef = doc(firestore, 'settings/homepage');
        const animeIds = spotlightAnimes.map(a => a.id);
        
        setDocumentNonBlocking(settingsRef, { spotlightAnimeIds: animeIds }, { merge: true });

        toast.success("Spotlight saved!", { id: toastId });
        setIsSaving(false);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><TrendingUp className="w-8 h-8"/> Trending & Featured</h1>
                <p className="text-muted-foreground">Manually override or adjust trending and featured content.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> Homepage Spotlight</CardTitle>
                                <CardDescription>Manage the anime featured in the main homepage carousel.</CardDescription>
                            </div>
                            <AddSpotlightDialog onAdd={handleAddAnime} />
                        </CardHeader>
                        <CardContent>
                           {(loadingSettings || isFetchingDetails) ? (
                                <div className="h-64 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin"/></div>
                           ) : spotlightAnimes.length > 0 ? (
                               <div className="space-y-2">
                                   {spotlightAnimes.map((anime, index) => (
                                       <div key={anime.id} className="flex items-center gap-4 p-2 rounded-lg bg-card border border-border">
                                           <div className="font-bold text-lg w-6 text-center text-muted-foreground">{index + 1}</div>
                                           <div className="relative w-12 h-16 flex-shrink-0">
                                               <ProgressiveImage src={anime.poster} alt={anime.name} fill className="object-cover rounded-md" />
                                           </div>
                                           <p className="font-semibold flex-1 truncate">{anime.name}</p>
                                           <div className="flex items-center gap-1">
                                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                                                   <ArrowUp className="w-4 h-4"/>
                                               </Button>
                                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMove(index, 'down')} disabled={index === spotlightAnimes.length - 1}>
                                                   <ArrowDown className="w-4 h-4"/>
                                               </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveAnime(anime.id)}>
                                                   <Trash2 className="w-4 h-4"/>
                                               </Button>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           ) : (
                               <p className="text-center text-muted-foreground py-10">No anime in the spotlight. Add one to get started.</p>
                           )}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveChanges} disabled={isSaving || loadingSettings || isFetchingDetails} className="ml-auto">
                                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                                Save Spotlight
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Trending Algorithm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Configuration for trending algorithms is under development.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Featured Sections</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-muted-foreground">Management for other homepage sections (e.g., "Most Popular") is under development.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
