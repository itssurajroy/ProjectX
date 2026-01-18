
'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Tv, Loader2, Star, BarChart3, TrendingUp, Flame } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import dynamic from 'next/dynamic';
import { useUser, useCollection } from '@/firebase';
import { UserHistory } from '@/lib/types/anime';
import { AnimeService } from '@/lib/services/AnimeService';
import Link from 'next/link';
import { differenceInDays, startOfDay } from 'date-fns';

const ActivityHeatmap = dynamic(() => import('@/components/dashboard/ActivityHeatmap'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-card/50 rounded-lg flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin"/></div>
});

const GenreChart = dynamic(() => import('@/components/dashboard/GenreChart'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-card/50 rounded-lg flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin"/></div>
});

export default function StatsPage() {
    const { user } = useUser();
    const { data: history, loading: loadingHistory } = useCollection<UserHistory>(`users/${user?.uid}/history`);

    const animeIds = useMemo(() => {
        if (!history) return [];
        return [...new Set(history.map(item => item.animeId))];
    }, [history]);

    const { data: animeDetails, isLoading: loadingAnimeDetails } = useQuery({
        queryKey: ['animeDetailsForStats', animeIds],
        queryFn: async () => {
            const animeMap = new Map<string, any>();
            for (const id of animeIds) {
                try {
                    const res = await AnimeService.anime(id);
                    if (res?.anime?.info) animeMap.set(id, res.anime.info);
                } catch { /* ignore individual failures */ }
            }
            return animeMap;
        },
        enabled: animeIds.length > 0,
    });

    const stats = useMemo(() => {
        if (!history || !animeDetails) return null;

        const totalEpisodes = history.length;
        let totalMinutes = 0;
        
        history.forEach(h => {
             const anime = animeDetails.get(h.animeId);
            if (anime && anime.stats.duration) {
                const durationMinutes = parseInt(anime.stats.duration.split(' ')[0], 10);
                totalMinutes += isNaN(durationMinutes) ? 24 : durationMinutes;
            } else {
                totalMinutes += 24; // Default to 24 mins
            }
        });
        
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        const genreCounts = new Map<string, number>();
        history.forEach(h => {
            const anime = animeDetails.get(h.animeId);
            anime?.moreInfo?.genres?.forEach((genre: string) => {
                genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
            });
        });

        const sortedGenres = Array.from(genreCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const activity: Record<string, number> = {};
        const uniqueDays = new Set<string>();
        history.forEach(h => {
            if (h.watchedAt) {
                const date = h.watchedAt.toDate().toISOString().split('T')[0];
                activity[date] = (activity[date] || 0) + 1;
                uniqueDays.add(startOfDay(h.watchedAt.toDate()).toISOString());
            }
        });

        let streak = 0;
        if(uniqueDays.size > 0) {
            const sortedDays = Array.from(uniqueDays).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
            let currentStreak = 0;
            if (differenceInDays(startOfDay(new Date()), sortedDays[0]) <= 1) {
                currentStreak = 1;
                for (let i = 0; i < sortedDays.length - 1; i++) {
                    if (differenceInDays(sortedDays[i], sortedDays[i+1]) === 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
            streak = currentStreak;
        }

        return {
            totalEpisodes,
            totalHours,
            totalMinutes: remainingMinutes,
            genreCounts: sortedGenres,
            activity,
            streak
        };
    }, [history, animeDetails]);
    
    const isLoading = loadingHistory || loadingAnimeDetails;
    
    if (!user && !isLoading) {
        return (
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                    <BarChart3 className="w-8 h-8 text-primary" />
                    Statistics
                </h1>
                <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Log in to view your statistics.</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
               <Loader2 className="w-12 h-12 animate-spin text-primary" />
           </div>
        )
    }

    if (!stats || stats.totalEpisodes === 0) {
        return (
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                    <BarChart3 className="w-8 h-8 text-primary" />
                    Statistics
                </h1>
                <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Not enough data to display stats.</p>
                    <p className="text-sm text-primary hover:underline mt-2"><Link href="/home">Start watching to build your profile!</Link></p>
                </div>
            </div>
        )
    }
    
    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                Your Stats
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Episodes" value={stats.totalEpisodes} icon={Tv} accent="purple" subtitle="Cursed energy is flowing." />
                <StatCard title="Watch Time" value={`${stats.totalHours}h ${stats.totalMinutes}m`} icon={Clock} accent="gold" subtitle="Equivalent to ~3 full seasons" />
                <StatCard title="Current Streak" value={stats.streak > 0 ? `${stats.streak} day${stats.streak > 1 ? 's' : ''}` : 'N/A'} icon={Flame} accent="red" subtitle={stats.streak > 3 ? "You're on fire!" : "Keep it going!"} />
                <StatCard title="Top Genre" value={stats.genreCounts[0]?.name || 'N/A'} icon={TrendingUp} subtitle={stats.genreCounts[0]?.count ? `${stats.genreCounts[0].count} episodes` : 'Start watching to reveal'} />
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4 font-display">Activity Heatmap</h2>
                <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                    <ActivityHeatmap activity={stats.activity} />
                </div>
            </div>

             <div>
                <h2 className="text-2xl font-bold mb-4 font-display">Genre Distribution</h2>
                <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                    <GenreChart data={stats.genreCounts.slice(0, 10)} />
                </div>
            </div>

        </div>
    )
}
