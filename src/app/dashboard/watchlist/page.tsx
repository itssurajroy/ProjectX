'use client';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { AnimeBase, UserHistory } from '@/lib/types/anime';
import { WatchlistItem } from '@/lib/types/watchlist';
import { AnimeService } from '@/lib/services/AnimeService';
import { useUser, useCollection } from '@/firebase';
import WatchlistControls from '@/components/dashboard/WatchlistControls';
import WatchlistCard from '@/components/dashboard/WatchlistCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';

type AnimeWithProgress = AnimeBase & {
    progress: { watched: number; total: number };
    status: WatchlistItem['status'];
};

export default function WatchlistPage() {
    const { user } = useUser();
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('addedAt_desc');
    
    const { data: watchlistItems, loading: isLoadingWatchlist } = useCollection<WatchlistItem>(`users/${user?.uid}/watchlist`);
    const { data: historyItems, loading: isLoadingHistory } = useCollection<UserHistory>(`users/${user?.uid}/history`);

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
    
    const processedItems = useMemo((): AnimeWithProgress[] => {
        if (!watchlistItems || !animeDetails || !historyItems) return [];
        
        const historyByAnime = new Map<string, Set<number>>();
        historyItems.forEach(h => {
            if (!historyByAnime.has(h.animeId)) {
                historyByAnime.set(h.animeId, new Set());
            }
            historyByAnime.get(h.animeId)!.add(h.episodeNumber);
        });

        let items = watchlistItems
            .map(item => {
                const details = animeDetails.get(item.id);
                if (!details) return null;
                
                const watchedCount = historyByAnime.get(item.id)?.size || 0;
                const totalEpisodes = details.episodes?.sub || 0;
                
                return {
                    ...details,
                    status: item.status,
                    addedAt: item.addedAt,
                    progress: {
                        watched: watchedCount,
                        total: totalEpisodes,
                    },
                };
            })
            .filter((item): item is AnimeWithProgress & { addedAt: any } => !!item);

        if (statusFilter !== 'All') {
            items = items.filter(item => item.status === statusFilter);
        }

        items.sort((a, b) => {
            if (sortOrder === 'name_asc') return a.name.localeCompare(b.name);
            if (sortOrder === 'name_desc') return b.name.localeCompare(a.name);
            if (sortOrder === 'addedAt_desc') return (b.addedAt?.toMillis() || 0) - (a.addedAt?.toMillis() || 0);
            return 0;
        });

        return items;

    }, [watchlistItems, animeDetails, historyItems, statusFilter, sortOrder]);


    const isLoading = isLoadingWatchlist || isLoadingHistory || (animeIds.length > 0 && isLoadingAnime);
    
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

    const renderContent = () => {
        if (isLoading) {
             return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            )
        }
        
        if (processedItems.length === 0) {
            return (
                <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">No anime in this category.</p>
                    <Button asChild variant="link"><Link href="/home">Explore Anime</Link></Button>
                </div>
            )
        }
        
        return (
             <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4">
                    {processedItems.map(anime => (
                        <CarouselItem key={anime.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/7 pl-4">
                            <WatchlistCard anime={anime} status={anime.status} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-card/80 hover:bg-card hidden sm:flex" />
                <CarouselNext className="right-2 bg-card/80 hover:bg-card hidden sm:flex" />
            </Carousel>
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
            
            {renderContent()}
        </div>
    )
}
