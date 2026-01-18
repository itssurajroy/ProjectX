
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { UserProfile } from "@/lib/types/user";
import { Activity, Users, Film, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format } from "date-fns";
import UserGrowthChart from "@/components/admin/UserGrowthChart";

export default function AdminDashboardPage() {
    const { data: users, loading: loadingUsers } = useCollection<UserProfile>('users');
    
    // This is a placeholder. In a real app, this would query an 'animes' collection.
    const { data: animeCount, isLoading: loadingAnimeCount } = useQuery({
        queryKey: ['animeCount'],
        queryFn: async () => { 
            // In a real scenario, you'd do a count query on the 'animes' collection.
            // For now, we'll return a static number.
            return 2150;
        },
    });

    // This is a placeholder for recent activity.
    const { data: recentActivityCount, isLoading: loadingRecentActivity } = useQuery({
        queryKey: ['recentActivityCount'],
        queryFn: async () => {
            // This would query a 'logs' or 'comments' collection for recent entries.
            return 125; // Static for now
        }
    });

    const userGrowthData = useMemo(() => {
        if (!users) return [];
        
        // Count new users per day
        const dailyCounts: { [key: string]: { date: Date, count: number } } = {};
        users.forEach(user => {
            if (user.createdAt?.toDate) {
                const date = format(user.createdAt.toDate(), 'yyyy-MM-dd');
                if (!dailyCounts[date]) {
                    dailyCounts[date] = { date: user.createdAt.toDate(), count: 0 };
                }
                dailyCounts[date].count++;
            }
        });
    
        // Get the last 30 distinct days that had signups
        return Object.values(dailyCounts)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(-30)
            .map(item => ({
                date: format(item.date, 'MMM dd'),
                users: item.count,
            }));
    
    }, [users]);


    const kpiData = [
        { title: "Total Users", value: loadingUsers ? <Loader2 className="w-5 h-5 animate-spin" /> : users?.length.toLocaleString() || '0', icon: Users },
        { title: "Total Anime", value: loadingAnimeCount ? <Loader2 className="w-5 h-5 animate-spin" /> : animeCount?.toLocaleString() || '0', icon: Film },
        { title: "Recent Activity (24h)", value: loadingRecentActivity ? <Loader2 className="w-5 h-5 animate-spin" /> : recentActivityCount?.toLocaleString() || '0', icon: Activity },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of ProjectX system health and metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map(kpi => (
                     <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loadingUsers ? (
                     <Card>
                        <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </CardContent>
                    </Card>
                ) : (
                    <UserGrowthChart data={userGrowthData} />
                )}
                 <Card>
                    <CardHeader><CardTitle>Genre Distribution</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">A chart showing the distribution of genres across all content will appear here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
