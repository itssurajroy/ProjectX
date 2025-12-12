
'use client';

import { AnimeBase } from '@/lib/types/anime';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/services/AnimeService';
import { useMemo } from 'react';
import { Award, BookOpen, Calendar, Clapperboard, Film, Flame, Loader2, Star, TrendingUp, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser } from '@/firebase/client';
import { UserHistory } from '@/lib/types/anime';
import { WatchlistItem } from '@/lib/types/watchlist';
import { useCollection } from '@/firebase/client';
import AchievementCard from '@/components/dashboard/AchievementCard';

const achievementsList = [
    { id: 'novice-watcher', title: 'Novice Watcher', description: 'Watch 10 episodes.', goal: 10, icon: <Clapperboard className="w-8 h-8" />, type: 'episodes' },
    { id: 'anime-adept', title: 'Anime Adept', description: 'Watch 100 episodes.', goal: 100, icon: <Film className="w-8 h-8" />, type: 'episodes' },
    { id: 'series-veteran', title: 'Series Veteran', description: 'Watch 500 episodes.', goal: 500, icon: <Flame className="w-8 h-8" />, type: 'episodes' },
    { id: 'anime-master', title: 'Anime Master', description: 'Watch 1000 episodes.', goal: 1000, icon: <Trophy className="w-8 h-8" />, type: 'episodes' },
    { id: 'series-starter', title: 'Series Starter', description: 'Start watching 5 different anime.', goal: 5, icon: <BookOpen className="w-8 h-8" />, type: 'series' },
    { id: 'series-completer', title: 'Series Completer', description: 'Mark 1 anime as "Completed".', goal: 1, icon: <Star className="w-8 h-8" />, type: 'completed' },
    { id: 'dedicated-fan', title: 'Dedicated Fan', description: 'Complete 10 anime.', goal: 10, icon: <Award className="w-8 h-8" />, type: 'completed' },
    { id: 'genre-explorer', title: 'Genre Explorer', description: 'Watch anime from 5 different genres.', goal: 5, icon: <TrendingUp className="w-8 h-8" />, type: 'genres' },
];


export default function AchievementsPage() {
    const { user } = useUser();
    const { data: history, loading: loadingHistory } = useCollection<UserHistory>(`users/${user?.uid}/history`);
    const { data: watchlist, loading: loadingWatchlist } = useCollection<WatchlistItem>(`users/${user?.uid}/watchlist`);

    const animeIds = useMemo(() => {
        if (!history) return [];
        return [...new Set(history.map(item => item.animeId))];
    }, [history]);

    const { data: animeDetails, isLoading: loadingAnimeDetails } = useQuery({
        queryKey: ['animeDetailsForAchievements', animeIds],
        queryFn: async () => {
            const animeMap = new Map<string, any>();
            for (const id of animeIds) {
                try {
                    const res = await AnimeService.qtip(id);
                    if (res?.anime) animeMap.set(id, res.anime);
                } catch { /* ignore individual failures */ }
            }
            return animeMap;
        },
        enabled: animeIds.length > 0,
    });

    const achievementProgress = useMemo(() => {
        if (!history || !watchlist || !animeDetails) return {};
        
        const episodesWatched = history.length;
        const seriesWatched = new Set(history.map(h => h.animeId)).size;
        const completedSeries = watchlist.filter(w => w.status === 'Completed').length;
        
        const watchedGenres = new Set<string>();
        history.forEach(h => {
            const anime = animeDetails.get(h.animeId);
            anime?.genres?.forEach((genre: string) => watchedGenres.add(genre));
        });

        return {
            episodes: episodesWatched,
            series: seriesWatched,
            completed: completedSeries,
            genres: watchedGenres.size
        }

    }, [history, watchlist, animeDetails]);

    const isLoading = loadingHistory || loadingWatchlist || loadingAnimeDetails;
    
    if (!user && !isLoading) {
        return (
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                    <Trophy className="w-8 h-8 text-primary" />
                    Achievements
                </h1>
                <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Please log in to view your achievements.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-primary" />
                Achievements
            </h1>

            {isLoading ? (
                 <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
                    {achievementsList.map(ach => (
                        <AchievementCard key={ach.id} achievement={ach} progress={(achievementProgress as any)[ach.type] || 0} />
                    ))}
                </div>
            )}
        </div>
    )
}
