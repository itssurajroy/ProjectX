'use client';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { AnimeBase } from '@/lib/types/anime';
import { WatchlistItem } from '@/lib/types/watchlist';
import { AnimeService } from '@/lib/services/AnimeService';
import { useUser, useCollection } from '@/firebase';
import WatchlistGrid from '@/components/dashboard/WatchlistGrid';
import WatchlistControls from '@/components/dashboard/WatchlistControls';

export default function WatchlistPage() {
    const { user } = useUser();
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('addedAt_desc');
    
    const { data: watchlistItems, loading: isLoadingWatchlist } = useCollection<WatchlistItem>(`users/${user?.uid}/watchlist`);

    const animeIds = useMemo(() => {
        if (!watchlistItems) return [];
        return watchlistItems.map(item => item.id);
    }, [watchlistItems]);

    const { data: animeDetails, isLoading: isLoadingAnime } = useQuery({
        queryKey: ['watchlistAnimeDetails', animeIds],
        queryFn: async () => {
            const promises = animeIds.map(id => AnimeService.anime(id).catch(() => null));
            const results = await Promise.all(promises);
            const animeMap = new Map<string, AnimeBase>();
            results.forEach(res => {
                if (res && res.anime && res.anime.info) {
                    animeMap.set(res.anime.info.id, res.anime.info as AnimeBase);
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
            <WatchlistControls
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
            
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
