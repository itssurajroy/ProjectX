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
import AnimeImage from '@/components/AnimeImage';


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
            <AnimeImage src={anime.poster} alt={anime.name} className="object-cover rounded-md" />
        </div>
        <div className='overflow-hidden flex-1'>
            <p className='font-semibold text-sm group-hover:text-primary line-clamp-1'>{anime.name}</p>
            <p className="text-xs text-muted-foreground">{count} episodes watched</p>
        </div>
    </Link>
);

const COLORS = ["#a855f7", "#ec4899", "#f97316", "#10b981", "#3b82f6", "#fde047"];

export default function StatsPage() {
    // This page is now non-functional as it relied on Firebase for user data.
    // Displaying a placeholder state.
    const isLoading = false;
    const stats = {
        totalEpisodes: 0,
        totalHours: 0,
        genreCounts: [],
        activity: {},
        mostWatchedAnime: [],
    };
    
    if (isLoading) {
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

            <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                <p className="text-muted-foreground">Please log in to view your statistics.</p>
                 <p className="text-xs text-muted-foreground mt-1">This feature is temporarily disabled.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-20 pointer-events-none">
                <StatCard title="Total Episodes Watched" value={stats.totalEpisodes} icon={Tv} />
                <StatCard title="Total Watch Time (Hours)" value={stats.totalHours} icon={Clock} />
                <StatCard title="Most Watched Genre" value={stats.genreCounts[0]?.name || 'N/A'} icon={Star} />
            </div>

        </div>
    )
}
