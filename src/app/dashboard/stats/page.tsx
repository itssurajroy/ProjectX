
'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, Tv, Loader2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import StatCard from '@/components/dashboard/StatCard';


const ActivityHeatmap = dynamic(() => import('@/components/dashboard/ActivityHeatmap'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin"/></div>
});

export default function StatsPage() {
    // This page is now non-functional as it relied on a user database.
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
                <p className="text-muted-foreground">Log in to view your statistics.</p>
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
