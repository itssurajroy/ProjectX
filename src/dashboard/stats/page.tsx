
'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Tv, Loader2, Star, BarChart3, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import dynamic from 'next/dynamic';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/useCollection';
import { UserHistory } from '@/lib/types/anime';
import { AnimeService } from '@/lib/services/AnimeService';
import Link from 'next/link';

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
                    const res = await AnimeService.qtip(id);
                    if (res?.anime) animeMap.set(id, res.anime);
                } catch { /* ignore individual failures */ }
            }
            return animeMap;
        },
        enabled: animeIds.length > 0,
    });

    const stats = useMemo(() => {
        if (!history || !animeDetails) return null;

        const totalEpisodes = history.length;
        const totalMinutes = history.reduce((sum, h) => {
            const anime = animeDetails.get(h.animeId);
            if (anime && anime.duration) {
                const durationMinutes = parseInt(anime.duration.split(' ')[0], 10);
                if (!isNaN(durationMinutes)) {
                    return sum + durationMinutes;
                }
            }
            return sum + 24; // Default to 24 mins if duration is unknown
        }, 0);

        const genreCounts = new Map<string, number>();
        history.forEach(h => {
            const anime = animeDetails.get(h.animeId);
            anime?.genres?.forEach((genre: string) => {
                genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
            });
        });

        const sortedGenres = Array.from(genreCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const activity: Record<string, number> = {};
        history.forEach(h => {
            if (h.watchedAt) {
                const date = h.watchedAt.toDate().toISOString().split('T')[0];
                activity[date] = (activity[date] || 0) + 1;
            }
        });

        return {
            totalEpisodes,
            totalHours: Math.round(totalMinutes / 60),
            genreCounts: sortedGenres,
            activity,
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
        <div className="space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                Statistics
            </h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Episodes Watched" value={stats.totalEpisodes} icon={Tv} />
                <StatCard title="Total Watch Time (Hours)" value={stats.totalHours} icon={Clock} />
                <StatCard title="Most Watched Genre" value={stats.genreCounts[0]?.name || 'N/A'} icon={TrendingUp} />
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Activity Heatmap</h2>
                <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                    <ActivityHeatmap activity={stats.activity} />
                </div>
            </div>

             <div>
                <h2 className="text-xl font-bold mb-4">Genre Distribution</h2>
                <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                    <GenreChart data={stats.genreCounts.slice(0, 10)} />
                </div>
            </div>

        </div>
    )
}
