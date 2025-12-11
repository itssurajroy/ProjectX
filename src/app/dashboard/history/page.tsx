
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { UserHistory, AnimeBase } from '@/types/anime';
import { History, Loader2, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import Link from 'next/link';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import ProgressiveImage from '@/components/ProgressiveImage';

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
            <div className="text-right text-xs text-muted-foreground">
                <p>{formatDistanceToNow(item.watchedAt.toDate(), { addSuffix: true })}</p>
            </div>
        </div>
    );
};


export default function HistoryPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const historyQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, `users/${user.uid}/history`),
            orderBy('watchedAt', 'desc')
        );
    }, [user, firestore]);

    const { data: history, isLoading } = useCollection<UserHistory>(historyQuery);

    const animeIds = useMemo(() => {
        if (!history) return [];
        return [...new Set(history.map(item => item.animeId))];
    }, [history]);

    const { data: animeDetails, isLoading: isLoadingAnimeDetails } = useQuery({
        queryKey: ['animeDetails', animeIds],
        queryFn: async () => {
            const animeData: Record<string, AnimeBase> = {};
            const promises = animeIds.map(async (id) => {
                try {
                    const data = await AnimeService.anime(id);
                    if (data?.anime?.info) {
                       animeData[id] = data.anime.info;
                    }
                } catch (e) {
                    console.warn(`Could not fetch details for anime ${id}`);
                }
            });
            await Promise.all(promises);
            return animeData;
        },
        enabled: animeIds.length > 0,
    });

    const groupedHistory = useMemo(() => {
        if (!history) return {};
        return history.reduce((acc, item) => {
            const date = item.watchedAt.toDate();
            let dayLabel: string;
            if (isToday(date)) {
                dayLabel = 'Today';
            } else if (isYesterday(date)) {
                dayLabel = 'Yesterday';
            } else {
                dayLabel = format(date, 'MMMM d, yyyy');
            }
            if (!acc[dayLabel]) {
                acc[dayLabel] = [];
            }
            acc[dayLabel].push(item);
            return acc;
        }, {} as Record<string, UserHistory[]>);
    }, [history]);
    
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <History className="w-8 h-8 text-primary" />
                Watch History
            </h1>

            {(isLoading || isLoadingAnimeDetails) && (
                 <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            )}

            {!isLoading && history?.length === 0 && (
                <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Your watch history is empty.</p>
                </div>
            )}
            
            <div className="space-y-8">
                {Object.entries(groupedHistory).map(([day, items]) => (
                    <section key={day}>
                        <h2 className="text-xl font-bold font-display mb-4 border-b border-border/50 pb-2">{day}</h2>
                        <div className="space-y-3">
                            {items.map(item => (
                                <HistoryItem key={item.id} item={item} anime={animeDetails?.[item.animeId]} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

        </div>
    )
}
