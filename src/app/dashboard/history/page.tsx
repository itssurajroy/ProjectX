'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History as HistoryIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { UserHistory, AnimeBase } from '@/lib/types/anime';
import { AnimeService } from '@/lib/services/AnimeService';
import { useUser, useCollection } from '@/firebase';
import HistoryGroup from '@/components/dashboard/HistoryGroup';
import ContinueWatchingCard from '@/components/dashboard/ContinueWatchingCard';

export default function HistoryPage() {
    const { user } = useUser();
    // Fetch all history items, unsorted for now
    const { data: history, loading: isLoadingHistory } = useCollection<UserHistory>(`users/${user?.uid}/history`);
    
    // Get all unique anime IDs from history
    const animeIds = useMemo(() => {
        if (!history) return [];
        return [...new Set(history.map(item => item.animeId))];
    }, [history]);
    
    // Fetch details for all unique animes in history
    const { data: animeDetails, isLoading: isLoadingAnime } = useQuery<Map<string, AnimeBase>>({
        queryKey: ['animeDetails', animeIds],
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
        enabled: animeIds.length > 0
    });

    // Sort history by most recently watched
    const sortedHistory = useMemo(() => {
        if (!history) return [];
        return [...history].sort((a, b) => (b.watchedAt?.toMillis() || 0) - (a.watchedAt?.toMillis() || 0));
    }, [history]);

    // The most recent item is for the "Continue Watching" hero card
    const latestHistoryItem = sortedHistory?.[0];
    const latestAnimeDetails = latestHistoryItem ? animeDetails?.get(latestHistoryItem.animeId) : null;

    // Group the rest of the history by anime
    const groupedHistory = useMemo(() => {
        if (!sortedHistory || sortedHistory.length < 1 || !animeDetails) return {};

        // Exclude the anime series of the most recent item from the grouped list below
        const latestAnimeId = sortedHistory[0]?.animeId;

        return sortedHistory.reduce((acc, item) => {
            if (item.animeId === latestAnimeId) return acc; // Skip items from the hero anime
            
            const anime = animeDetails.get(item.animeId);
            if (anime) {
                if (!acc[anime.name]) {
                    acc[anime.name] = [];
                }
                // Don't add duplicates for the same episode
                if (!acc[anime.name].some(i => i.episodeNumber === item.episodeNumber)) {
                   acc[anime.name].push(item);
                }
            }
            return acc;
        }, {} as Record<string, UserHistory[]>);
    }, [sortedHistory, animeDetails]);


    const isLoading = isLoadingHistory || (animeIds.length > 0 && isLoadingAnime);

    if (!user && !isLoading) {
         return (
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                    <HistoryIcon className="w-8 h-8 text-primary" />
                    Watch History
                </h1>
                 <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Log in to see your watch history.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <HistoryIcon className="w-8 h-8 text-primary" />
                Watch History
            </h1>

            {isLoading ? (
                 <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : history && history.length > 0 ? (
                <div className="space-y-8">
                    {latestHistoryItem && latestAnimeDetails && (
                        <ContinueWatchingCard historyItem={latestHistoryItem} animeDetails={latestAnimeDetails} />
                    )}

                    {Object.keys(groupedHistory).length > 0 && (
                        <div className="pt-8 border-t border-border/50 space-y-8">
                            {Object.entries(groupedHistory).map(([animeName, historyItems]) => (
                                <HistoryGroup key={animeName} title={animeName} items={historyItems} animeDetails={animeDetails} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Your watch history is empty.</p>
                    <p className="text-sm text-primary hover:underline mt-2"><Link href="/home">Start watching now!</Link></p>
                </div>
            )}
        </div>
    )
}
