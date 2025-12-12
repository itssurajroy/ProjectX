
'use client';

import { UserHistory, AnimeBase } from '@/lib/types/anime';
import { History, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/services/AnimeService';
import Link from 'next/link';
import { format, isToday, isYesterday } from 'date-fns';
import { useMemo } from 'react';
import { useUser, useCollection } from '@/firebase/client';
import HistoryGroup from '@/components/dashboard/HistoryGroup';

export default function HistoryPage() {
    const { user } = useUser();
    const { data: history, loading: isLoadingHistory } = useCollection<UserHistory>(`users/${user?.uid}/history`);
    
    const animeIds = useMemo(() => {
        if (!history) return [];
        return [...new Set(history.map(item => item.animeId))];
    }, [history]);
    
    const { data: animeDetails, isLoading: isLoadingAnime } = useQuery<Map<string, AnimeBase>>({
        queryKey: ['animeDetails', animeIds],
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
        enabled: animeIds.length > 0
    });

    const groupedHistory = useMemo(() => {
        if (!history) return {};
        return history.reduce((acc, item) => {
            if (!item.watchedAt) return acc;
            const date = item.watchedAt.toDate();
            let key = 'Older';
            if(isToday(date)) key = 'Today';
            else if (isYesterday(date)) key = 'Yesterday';
            else key = format(date, 'MMMM d, yyyy');
            
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, UserHistory[]>);
    }, [history]);

    const sortedGroupKeys = Object.keys(groupedHistory).sort((a,b) => {
        if (a === 'Today') return -1;
        if (b === 'Today') return 1;
        if (a === 'Yesterday') return -1;
        if (b === 'Yesterday') return 1;
        return new Date(b).getTime() - new Date(a).getTime();
    });

    const isLoading = isLoadingHistory || (animeIds.length > 0 && isLoadingAnime);

    if (!user && !isLoadingHistory) {
         return (
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                    <History className="w-8 h-8 text-primary" />
                    Watch History
                </h1>
                 <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Log in to see your watch history.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <History className="w-8 h-8 text-primary" />
                Watch History
            </h1>

            {isLoading ? (
                 <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : history && history.length > 0 ? (
                <div className="space-y-8">
                    {sortedGroupKeys.map(key => (
                        <HistoryGroup key={key} title={key} items={groupedHistory[key]} animeDetails={animeDetails} />
                    ))}
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
