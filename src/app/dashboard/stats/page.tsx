
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { UserHistory } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { useMemo } from 'react';
import { BarChart3, Clock, Tv, Loader2, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import dynamic from 'next/dynamic';


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

const COLORS = ["#a855f7", "#ec4899", "#f97316", "#10b981", "#3b82f6", "#fde047"];

export default function StatsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const historyQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/history`));
    }, [user, firestore]);

    const { data: history, isLoading: isLoadingHistory } = useCollection<UserHistory>(historyQuery);

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
                    if (data?.anime) {
                       animeData[id] = data.anime;
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
    
    const stats = useMemo(() => {
        if (!history || !animeDetails) return {
            totalEpisodes: 0,
            totalHours: 0,
            genreCounts: [],
            activity: {},
        };

        const totalMinutes = history.reduce((acc, item) => acc + (item.progress / 60), 0);
        const uniqueEpisodes = new Set(history.map(item => item.episodeId)).size;
        
        const genreCounts: Record<string, number> = {};
        history.forEach(item => {
            const details = animeDetails[item.animeId];
            details?.moreInfo?.genres?.forEach((genre: string) => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });
        
        const sortedGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, value]) => ({ name, value }));

        const activity: Record<string, number> = {};
        history.forEach(item => {
            const date = new Date(item.watchedAt.seconds * 1000).toISOString().split('T')[0];
            activity[date] = (activity[date] || 0) + 1;
        });

        return {
            totalEpisodes: uniqueEpisodes,
            totalHours: Math.round(totalMinutes / 60),
            genreCounts: sortedGenres,
            activity,
        };

    }, [history, animeDetails]);

      
    if (isLoadingHistory || isLoadingAnimeDetails) {
        return (
            <div className="flex items-center justify-center h-64">
               <Loader2 className="w-12 h-12 animate-spin text-primary" />
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-3 bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <TrendingUp className="w-5 h-5 text-muted-foreground"/> Genre Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                <Pie data={stats.genreCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {stats.genreCounts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                 <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                
                <Card className="lg:col-span-4 bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-xl">Most Watched Anime</CardTitle>
                    </CardHeader>
                     <CardContent className="text-center py-16 text-muted-foreground">
                        <p>More detailed anime stats coming soon!</p>
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
