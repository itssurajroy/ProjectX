
'use client';

import { AnimeBase } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { useMemo } from 'react';
import { BarChart3, Clock, Tv, Loader2, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ProgressiveImage from '@/components/ProgressiveImage';
import { useUser, useCollection } from '@/firebase';
import { UserHistory } from '@/types/anime';


const ActivityHeatmap = dynamic(() => import('@/components/dashboard/ActivityHeatmap'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin"/></div>
});

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <Card className="bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
)

const MostWatchedAnimeCard = ({ anime, count }: { anime: AnimeBase, count: number }) => (
    <Link href={`/anime/${anime.id}`} className="flex items-center gap-3 group p-2 rounded-md hover:bg-muted/50 transition-colors">
        <div className="relative w-12 h-[72px] flex-shrink-0">
            <ProgressiveImage src={anime.poster} alt={anime.name} fill className="object-cover rounded-md" />
        </div>
        <div className='overflow-hidden flex-1'>
            <p className='font-semibold text-sm group-hover:text-primary line-clamp-1'>{anime.name}</p>
            <p className="text-xs text-muted-foreground">{count} episodes watched</p>
        </div>
    </Link>
);


const COLORS = ["#a855f7", "#ec4899", "#f97316", "#10b981", "#3b82f6", "#fde047"];

export default function StatsPage() {
    const { user } = useUser();
    const { data: history, loading: isLoadingHistory } = useCollection<UserHistory>(`users/${user?.uid}/history`);
    
    const animeIds = useMemo(() => {
        if (!history || history.length === 0) return [];
        return [...new Set(history.map(item => item.animeId))];
    }, [history]);

    const { data: animeDetails, isLoading: isLoadingAnime } = useQuery({
        queryKey: ['animeDetails', animeIds],
        queryFn: async () => {
            const promises = animeIds.map(id => AnimeService.qtip(id).catch(() => null));
            const results = await Promise.all(promises);
            const animeMap = new Map<string, AnimeBase>();
            results.forEach(res => {
                if (res && res.anime) {
                    animeMap.set(res.anime.id, res.anime);
                }
            });
            return animeMap;
        },
        enabled: animeIds.length > 0,
    });
    
    const stats = useMemo(() => {
        if (!history || history.length === 0 || !animeDetails) return {
            totalEpisodes: 0,
            totalHours: 0,
            genreCounts: [],
            activity: {},
            mostWatchedAnime: []
        };
        
        const totalEpisodes = history.length;
        const totalMinutes = history.reduce((acc, item) => acc + (item.duration || 0), 0);
        const totalHours = Math.round(totalMinutes / 60);

        const genreCounter: Record<string, number> = {};
        const animeEpCounts: Record<string, number> = {};
        const activity: Record<string, number> = {};

        history.forEach(item => {
            const anime = animeDetails.get(item.animeId);
            if (anime) {
                (anime as any).genres?.forEach((genre: string) => {
                    genreCounter[genre] = (genreCounter[genre] || 0) + 1;
                });
            }

            animeEpCounts[item.animeId] = (animeEpCounts[item.animeId] || 0) + 1;
            
            if (item.watchedAt) {
                const date = item.watchedAt.toDate().toISOString().split('T')[0];
                activity[date] = (activity[date] || 0) + 1;
            }
        });

        const genreCounts = Object.entries(genreCounter).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
        const mostWatchedAnime = Object.entries(animeEpCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
        
        return { totalEpisodes, totalHours, genreCounts, activity, mostWatchedAnime };
    }, [history, animeDetails]);

    const isLoading = isLoadingHistory || isLoadingAnime;
      
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
               <Loader2 className="w-12 h-12 animate-spin text-primary" />
           </div>
        )
    }
    
    if (!user) {
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
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                Statistics
            </h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Episodes Watched" value={stats.totalEpisodes} icon={Tv} />
                <StatCard title="Total Watch Time (Hours)" value={stats.totalHours} icon={Clock} />
                <StatCard title="Most Watched Genre" value={stats.genreCounts[0]?.name || 'N/A'} icon={Star} />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 <Card className="bg-card/50 border-border/50 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl">Genre Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.genreCounts.length > 0 ? (
                            <ChartContainer config={{}} className="aspect-square h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={stats.genreCounts.slice(0, 6)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                            {stats.genreCounts.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideIndicator />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        ) : <p className="text-center text-muted-foreground py-10">Not enough data for chart.</p>}
                    </CardContent>
                </Card>
                 <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Most Watched Anime</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {stats.mostWatchedAnime.length > 0 && animeDetails ? (
                            stats.mostWatchedAnime.map(([animeId, count]) => {
                                const anime = animeDetails.get(animeId);
                                if (!anime) return null;
                                return <MostWatchedAnimeCard key={animeId} anime={anime} count={count} />
                            })
                        ) : (
                            <p className="text-center text-muted-foreground py-10">Start watching to see your top anime!</p>
                        )}
                    </CardContent>
                </Card>
            </div>

             <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle className="text-xl">Watch Activity</CardTitle>
                </CardHeader>
                <CardContent>
                   <ActivityHeatmap activity={stats.activity} />
                </CardContent>
            </Card>

        </div>
    )
}
