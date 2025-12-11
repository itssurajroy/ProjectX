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
                <p>{/* Temporarily disabled: {formatDistanceToNow(item.watchedAt.toDate(), { addSuffix: true })} */}</p>
            </div>
        </div>
    );
};


export default function HistoryPage() {
    // This page is now non-functional as it relied on Firebase for user data.
    // Displaying a placeholder state.
    const isLoading = false;
    const history: UserHistory[] = [];
    const groupedHistory = {};

    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <History className="w-8 h-8 text-primary" />
                Watch History
            </h1>

            <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                <p className="text-muted-foreground">Please log in to see your watch history.</p>
                 <p className="text-xs text-muted-foreground mt-1">This feature is temporarily disabled.</p>
            </div>

        </div>
    )
}
