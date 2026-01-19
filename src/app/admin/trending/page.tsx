
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDoc, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2, TrendingUp, Sparkles, PlusCircle, Trash2, ArrowUp, ArrowDown, Search } from "lucide-react";
import { AnimeBase, SearchSuggestion } from "@/lib/types/anime";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/services/AnimeService";
import ProgressiveImage from "@/components/ProgressiveImage";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "use-debounce";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface FeaturedSection {
    id: string;
    title: string;
    enabled: boolean;
}

interface HomepageSettings {
    spotlightAnimeIds?: string[];
    featuredSections?: FeaturedSection[];
}

interface SpotlightAnime extends AnimeBase {
    // an id is already in AnimeBase
}

interface TrendingAlgorithmSettings {
    algorithm: 'weighted_score' | 'most_views';
    timeWindow: '24h' | '7d' | '30d';
    weights: {
        views: number;
        likes: number;
        comments: number;
    };
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

const TrendingAlgorithmCard = () => {
    const firestore = useFirestore();
    const { data: settingsData, loading: loadingSettings } = useDoc<TrendingAlgorithmSettings>('settings/trending_algorithm');

    const [settings, setSettings] = useState<TrendingAlgorithmSettings>({
        algorithm: 'weighted_score',
        timeWindow: '7d',
        weights: { views: 0.6, likes: 0.3, comments: 0.1 }
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settingsData) {
            setSettings(settingsData);
        }
    }, [settingsData]);

    const handleSave = () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving algorithm settings...");
        
        const totalWeight = Object.values(settings.weights).reduce((sum, w) => sum + Number(w), 0);
        if (settings.algorithm === 'weighted_score' && Math.abs(totalWeight - 1) > 0.01) {
            toast.error("Weights must add up to 1.", { id: toastId });
            setIsSaving(false);
            return;
        }

        const settingsRef = doc(firestore, 'settings', 'trending_algorithm');
        setDocumentNonBlocking(settingsRef, settings, { merge: true });
        toast.success("Settings saved!", { id: toastId });
        setIsSaving(false);
    };

    const handleWeightChange = (key: 'views' | 'likes' | 'comments', value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
            setSettings(prev => ({
                ...prev,
                weights: {
                    ...prev.weights,
                    [key]: numValue
                }
            }));
        } else if(value === '') {
             setSettings(prev => ({
                ...prev,
                weights: {
                    ...prev.weights,
                    [key]: 0
                }
            }));
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trending Algorithm</CardTitle>
                <CardDescription>Adjust the factors that determine trending content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {loadingSettings ? <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin"/></div> : <>
                    <div className="space-y-2">
                        <Label htmlFor="algorithm-select">Algorithm</Label>
                        <Select value={settings.algorithm} onValueChange={(val) => setSettings(p => ({...p, algorithm: val as any}))}>
                            <SelectTrigger id="algorithm-select"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weighted_score">Weighted Score</SelectItem>
                                <SelectItem value="most_views">Most Views</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timewindow-select">Time Window</Label>
                        <Select value={settings.timeWindow} onValueChange={(val) => setSettings(p => ({...p, timeWindow: val as any}))}>
                            <SelectTrigger id="timewindow-select"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">Last 24 Hours</SelectItem>
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="30d">Last 30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {settings.algorithm === 'weighted_score' && (
                        <div className="space-y-4 pt-4 border-t border-border">
                            <Label>Score Weights (must sum to 1)</Label>
                            <div className="space-y-2">
                                <Label htmlFor="views-weight" className="text-xs">Views Weight</Label>
                                <Input id="views-weight" type="number" step="0.1" min="0" max="1" value={settings.weights.views} onChange={e => handleWeightChange('views', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="likes-weight" className="text-xs">Likes Weight</Label>
                                <Input id="likes-weight" type="number" step="0.1" min="0" max="1" value={settings.weights.likes} onChange={e => handleWeightChange('likes', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="comments-weight" className="text-xs">Comments Weight</Label>
                                <Input id="comments-weight" type="number" step="0.1" min="0" max="1" value={settings.weights.comments} onChange={e => handleWeightChange('comments', e.target.value)} />
                            </div>
                        </div>
                    )}
                </> }
            </CardContent>
             <CardFooter>
                <Button onClick={handleSave} disabled={isSaving || loadingSettings} className="ml-auto">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Algorithm
                </Button>
            </CardFooter>
        </Card>
    )
}

const DEFAULT_SECTIONS: FeaturedSection[] = [
    { id: 'trending', title: 'Trending', enabled: true },
    { id: 'latest-episodes', title: 'Latest Episodes', enabled: true },
    { id: 'top-upcoming', title: 'Top Upcoming', enabled: true },
    { id: 'top-airing', title: 'Top Airing', enabled: true },
    { id: 'completed-series', title: 'Completed Series', enabled: true },
    { id: 'most-popular', title: 'Most Popular', enabled: true },
    { id: 'most-favorite', title: 'Most Favorite', enabled: true },
];

const FeaturedSectionsCard = () => {
    const firestore = useFirestore();
    const { data: homepageSettings, loading: loadingSettings } = useDoc<HomepageSettings>('settings/homepage');
    const [sections, setSections] = useState<FeaturedSection[]>([]);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (homepageSettings) {
            const firestoreSectionsMap = new Map(homepageSettings.featuredSections?.map(s => [s.id, s]));
            const mergedSections = DEFAULT_SECTIONS.map(defaultSection => 
                firestoreSectionsMap.get(defaultSection.id) || defaultSection
            );

            // Re-order mergedSections based on the order in firestore
            const orderedSections = homepageSettings.featuredSections
                ? homepageSettings.featuredSections.map(fs => mergedSections.find(ms => ms.id === fs.id)).filter(Boolean) as FeaturedSection[]
                : mergedSections;

            const existingIds = new Set(orderedSections.map(s => s.id));
            const newSections = mergedSections.filter(s => !existingIds.has(s.id));

            setSections([...orderedSections, ...newSections]);

        } else if (!loadingSettings) {
            setSections(DEFAULT_SECTIONS);
        }
        if (!loadingSettings) {
            isInitialLoad.current = true;
        }
    }, [homepageSettings, loadingSettings]);
    
    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        if (loadingSettings) return;
        
        const settingsRef = doc(firestore, 'settings/homepage');
        setDocumentNonBlocking(settingsRef, { featuredSections: sections }, { merge: true });

    }, [sections, firestore, loadingSettings]);


    const handleToggle = (id: string, enabled: boolean) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, enabled } : s));
        toast.success(`'${sections.find(s=>s.id===id)?.title}' section ${enabled ? 'enabled' : 'disabled'}.`);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;

        setSections(prev => {
            const newSections = [...prev];
            const temp = newSections[index];
            newSections[index] = newSections[newIndex];
            newSections[newIndex] = temp;
            return newSections;
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Featured Sections</CardTitle>
                <CardDescription>Reorder and toggle visibility of homepage sections.</CardDescription>
            </CardHeader>
            <CardContent>
                {loadingSettings ? (
                    <div className="h-64 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin"/></div>
                ) : (
                    <div className="space-y-2">
                        {sections.map((section, index) => (
                            <div key={section.id} className="flex items-center gap-4 p-2 rounded-lg bg-card border border-border">
                                <p className="font-semibold flex-1 truncate">{section.title}</p>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                                        <ArrowUp className="w-4 h-4"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMove(index, 'down')} disabled={index === sections.length - 1}>
                                        <ArrowDown className="w-4 h-4"/>
                                    </Button>
                                     <Switch checked={section.enabled} onCheckedChange={(checked) => handleToggle(section.id, checked)} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


// --- Main Component ---
export default function AdminTrendingPage() {
    const firestore = useFirestore();
    const { data: homepageSettings, loading: loadingSettings } = useDoc<HomepageSettings>('settings/homepage');
    const [spotlightAnimes, setSpotlightAnimes] = useState<SpotlightAnime[]>([]);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (homepageSettings?.spotlightAnimeIds) {
            setIsFetchingDetails(true);
            const fetchDetails = async () => {
                const animeDetailsPromises = homepageSettings.spotlightAnimeIds!.map(id => AnimeService.qtip(id).catch(() => null));
                const results = await Promise.all(animeDetailsPromises);
                const detailedAnimes = results
                    .filter(res => res && res.anime)
                    .map(res => res.anime as SpotlightAnime);
                
                const orderedAnimes = homepageSettings.spotlightAnimeIds!
                    .map(id => detailedAnimes.find(anime => anime.id === id))
                    .filter((a): a is SpotlightAnime => !!a);

                setSpotlightAnimes(orderedAnimes);
                setIsFetchingDetails(false);
                isInitialLoad.current = true;
            };
            fetchDetails();
        } else if (!loadingSettings) {
            setSpotlightAnimes([]);
            isInitialLoad.current = true;
        }
    }, [homepageSettings, loadingSettings]);
    
    // Real-time save effect
    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        if (loadingSettings || isFetchingDetails) return;
        
        const animeIds = spotlightAnimes.map(a => a.id);
        const settingsRef = doc(firestore, 'settings/homepage');
        setDocumentNonBlocking(settingsRef, { spotlightAnimeIds: animeIds }, { merge: true });

    }, [spotlightAnimes, firestore, loadingSettings, isFetchingDetails]);


    const handleAddAnime = (anime: SearchSuggestion) => {
        if (spotlightAnimes.some(a => a.id === anime.id)) {
            toast.error(`${anime.name} is already in the spotlight.`);
            return;
        }
        setSpotlightAnimes(prev => [...prev, anime as SpotlightAnime]);
        toast.success(`${anime.name} added to spotlight.`);
    };

    const handleRemoveAnime = (animeId: string) => {
        setSpotlightAnimes(prev => prev.filter(a => a.id !== animeId));
        toast.success(`Anime removed from spotlight.`);
    };
    
    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= spotlightAnimes.length) return;

        setSpotlightAnimes(prev => {
            const newAnimes = [...prev];
            const temp = newAnimes[index];
            newAnimes[index] = newAnimes[newIndex];
            newAnimes[newIndex] = temp;
            return newAnimes;
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><TrendingUp className="w-8 h-8"/> Trending &amp; Featured</h1>
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
                    </Card>
                </div>
                <div className="space-y-8">
                     <TrendingAlgorithmCard />
                     <FeaturedSectionsCard />
                </div>
            </div>
        </div>
    );
}
