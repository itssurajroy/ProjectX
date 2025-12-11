
'use client';

import { UserHistory, AnimeBase } from '@/types/anime';
import { History, Loader2, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import Link from 'next/link';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import ProgressiveImage from '@/components/ProgressiveImage';
import { useUser, useCollection } from '@/firebase';

const HistoryItem = ({ item, anime }: { item: UserHistory; anime: AnimeBase | undefined }) => {
    if (!anime) return null;

    const progress = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
    const watchUrl = `/watch/${item.animeId}?ep=${item.episodeNumber}`;

    return (
        <div className="flex items-center gap-4 p-3 bg-card/50 rounded-lg border border-border/50">
            <Link href={watchUrl} className="relative w-16 h-24 flex-shrink-0 group">
                <ProgressiveImage 
                    src={anime.poster}
                    alt={anime.name || "Anime Poster"} 
                    fill 
                    className="object-cover rounded-md" 
                />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white" />
                </div>
            </Link>
            <div className="flex-1 overflow-hidden">
                <Link href={`/anime/${anime.id}`} className="font-semibold hover:text-primary line-clamp-1">{anime.name}</Link>
                <p className="text-sm text-muted-foreground">Episode {item.episodeNumber}</p>
                 <div className="flex items-center gap-2 mt-2">
                    <Progress value={progress} className="h-1.5" />
                    <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
};

const HistoryGroup = ({ title, items, animeDetails }: { title: string, items: UserHistory[], animeDetails: Map<string, AnimeBase> | undefined }) => (
    <div>
        <h2 className="font-bold text-lg mb-3">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => <HistoryItem key={item.id} item={item} anime={animeDetails?.get(item.animeId)} />)}
        </div>
    </div>
);


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
