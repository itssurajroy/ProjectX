
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { UserHistory, WatchlistItem, AnimeBase } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { useMemo } from 'react';
import { Award, BookOpen, Calendar, Clapperboard, Film, Flame, Loader2, Star, TrendingUp, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const achievementsList = [
    { id: 'novice-watcher', title: 'Novice Watcher', description: 'Watch 10 episodes.', goal: 10, icon: <Clapperboard className="w-8 h-8" />, type: 'episodes' },
    { id: 'anime-adept', title: 'Anime Adept', description: 'Watch 100 episodes.', goal: 100, icon: <Film className="w-8 h-8" />, type: 'episodes' },
    { id: 'series-veteran', title: 'Series Veteran', description: 'Watch 500 episodes.', goal: 500, icon: <Flame className="w-8 h-8" />, type: 'episodes' },
    { id: 'anime-master', title: 'Anime Master', description: 'Watch 1000 episodes.', goal: 1000, icon: <Trophy className="w-8 h-8" />, type: 'episodes' },
    { id: 'series-starter', title: 'Series Starter', description: 'Start watching 5 different anime.', goal: 5, icon: <BookOpen className="w-8 h-8" />, type: 'series' },
    { id: 'series-completer', title: 'Series Completer', description: 'Mark 1 anime as "Completed".', goal: 1, icon: <Star className="w-8 h-8" />, type: 'completed' },
    { id: 'dedicated-fan', title: 'Dedicated Fan', description: 'Complete 10 anime.', goal: 10, icon: <Award className="w-8 h-8" />, type: 'completed' },
    { id: 'weekend-warrior', title: 'Weekend Warrior', description: 'Watch 10 episodes in one weekend.', goal: 10, icon: <Calendar className="w-8 h-8" />, type: 'streak' },
    { id: 'genre-explorer', title: 'Genre Explorer', description: 'Watch anime from 5 different genres.', goal: 5, icon: <TrendingUp className="w-8 h-8" />, type: 'genres' },
];

const AchievementCard = ({ achievement, progress }: { achievement: typeof achievementsList[0]; progress: number }) => {
    const isUnlocked = progress >= achievement.goal;
    const progressPercent = Math.min((progress / achievement.goal) * 100, 100);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all duration-300",
                        isUnlocked 
                            ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/20" 
                            : "bg-card/50 border-border/50"
                    )}>
                        <div className={cn("mb-3", isUnlocked ? "text-primary" : "text-muted-foreground")}>
                            {achievement.icon}
                        </div>
                        <h3 className="font-bold">{achievement.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 mb-3">{achievement.description}</p>
                        <div className="w-full mt-auto">
                            <Progress value={progressPercent} className="h-2"/>
                            <p className="text-xs text-muted-foreground mt-1">{Math.floor(progress)} / {achievement.goal}</p>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {isUnlocked ? <p>Unlocked!</p> : <p>{achievement.goal - progress} more to go!</p>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default function AchievementsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const historyQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/history`));
    }, [user, firestore]);

    const watchlistQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/watchlist`));
    }, [user, firestore]);

    const { data: history, isLoading: isLoadingHistory } = useCollection<UserHistory>(historyQuery);
    const { data: watchlist, isLoading: isLoadingWatchlist } = useCollection<WatchlistItem>(watchlistQuery);

    const animeIds = useMemo(() => {
        if (!history) return [];
        return [...new Set(history.map(item => item.animeId))];
    }, [history]);

    const { data: animeDetails, isLoading: isLoadingAnimeDetails } = useQuery({
        queryKey: ['animeDetails', animeIds],
        queryFn: async () => {
            const animeData: Record<string, any> = {};
            const promises = animeIds.map(async (id) => {
                try {
                    const data = await AnimeService.anime(id);
                    if (data?.anime) animeData[id] = data.anime;
                } catch (e) {
                    console.warn(`Could not fetch details for anime ${id}`);
                }
            });
            await Promise.all(promises);
            return animeData;
        },
        enabled: animeIds.length > 0,
    });

    const achievementProgress = useMemo(() => {
        const progress: Record<string, number> = {};
        if (!history || !watchlist || !animeDetails) return progress;

        // Total episodes
        const uniqueEpisodes = new Set(history.map(h => h.episodeId)).size;
        progress['episodes'] = uniqueEpisodes;

        // Started series
        const uniqueSeries = new Set(history.map(h => h.animeId)).size;
        progress['series'] = uniqueSeries;

        // Completed series
        const completedSeries = watchlist.filter(item => item.status === 'Completed').length;
        progress['completed'] = completedSeries;

        // Watched genres
        const watchedGenres = new Set<string>();
        history.forEach(item => {
            const details = animeDetails[item.animeId];
            details?.moreInfo?.genres?.forEach((genre: string) => watchedGenres.add(genre));
        });
        progress['genres'] = watchedGenres.size;
        
        // Weekend warrior
        const weekendEpisodes = history.filter(h => {
            const day = h.watchedAt.toDate().getDay();
            return day === 5 || day === 6 || day === 0; // Fri, Sat, Sun
        }).length;
        progress['streak'] = weekendEpisodes;


        return progress;
    }, [history, watchlist, animeDetails]);

    const isLoading = isLoadingHistory || isLoadingWatchlist || (animeIds.length > 0 && isLoadingAnimeDetails);

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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {achievementsList.map(ach => (
                        <AchievementCard key={ach.id} achievement={ach} progress={achievementProgress[ach.type] || 0} />
                    ))}
                </div>
            )}
        </div>
    )
}
