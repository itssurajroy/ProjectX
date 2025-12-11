
'use client';
import { useMemo, useState } from 'react';
import { AnimeBase } from '@/types/anime';
import { Bookmark, Filter, ListFilter, Loader2 } from 'lucide-react';
import { AnimeCard } from '@/components/AnimeCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import Link from 'next/link';

interface WatchlistItem extends AnimeBase {
    status: 'Watching' | 'Completed' | 'On-Hold' | 'Dropped' | 'Plan to Watch';
    addedAt: any;
}

const WatchlistGrid = ({ animes }: { animes: AnimeBase[] }) => {
    if (animes.length === 0) {
        return (
            <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                <p className="text-muted-foreground">No anime in this category.</p>
                 <Button asChild variant="link"><Link href="/home">Explore Anime</Link></Button>
            </div>
        )
    }
    return (
        <div className="grid-cards">
            {animes.map(anime => (
                <AnimeCard key={anime.id} anime={anime} />
            ))}
        </div>
    )
}

export default function WatchlistPage() {
    const user = null; // Mock user
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('addedAt_desc');
    
    const watchlistItems: WatchlistItem[] = [];
    const isLoadingWatchlist = false;

    const animeIds = useMemo(() => {
        if (!watchlistItems) return [];
        return watchlistItems.map(item => item.id);
    }, [watchlistItems]);

    const { data: animeDetails, isLoading: isLoadingAnime } = useQuery({
        queryKey: ['watchlistAnimeDetails', animeIds],
        queryFn: async () => {
            const promises = animeIds.map(id => AnimeService.qtip(id).catch(() => null));
            const results = await Promise.all(promises);
            const animeMap = new Map<string, AnimeBase>();
            results.forEach(res => {
                if (res && res.anime) {
                    animeMap.set(res.anime.id, res.anime as AnimeBase);
                }
            });
            return animeMap;
        },
        enabled: animeIds.length > 0,
    });

    const filteredAndSortedItems = useMemo(() => {
        if (!watchlistItems || !animeDetails) return [];
        
        let items = watchlistItems
            .filter(item => statusFilter === 'All' || item.status === statusFilter)
            .map(item => animeDetails.get(item.id))
            .filter((item): item is AnimeBase => !!item);

        items.sort((a: any, b: any) => {
            const aItem = watchlistItems.find(i => i.id === a.id);
            const bItem = watchlistItems.find(i => i.id === b.id);
            if (sortOrder === 'name_asc') return a.name.localeCompare(b.name);
            if (sortOrder === 'name_desc') return b.name.localeCompare(a.name);
            if (sortOrder === 'addedAt_desc') return (bItem?.addedAt?.toMillis() || 0) - (aItem?.addedAt?.toMillis() || 0);
            return 0;
        });

        return items;
    }, [watchlistItems, animeDetails, statusFilter, sortOrder]);


    const isLoading = isLoadingWatchlist || (animeIds.length > 0 && isLoadingAnime);
    const statuses = ['All', 'Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'];
    const sortOptions = [
        { value: 'addedAt_desc', label: 'Recently Added' },
        { value: 'name_asc', label: 'Title (A-Z)' },
        { value: 'name_desc', label: 'Title (Z-A)' },
    ];
    
    if (!user && !isLoading) {
         return (
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                    <Bookmark className="w-8 h-8 text-primary" />
                    Watchlist
                </h1>
                 <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Log in to manage your watchlist.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Bookmark className="w-8 h-8 text-primary" />
                    Watchlist
                </h1>
                <div className="flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <ListFilter className="w-4 h-4"/>
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                                {sortOptions.map(opt => (
                                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full sm:w-auto">
                    {statuses.map(s => (
                        <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : (
                <WatchlistGrid animes={filteredAndSortedItems} />
            )}
        </div>
    )
}
