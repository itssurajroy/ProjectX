
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { UserProfile } from "@/lib/types/user";
import { Activity, Users, Film, BarChart, Loader2 } from "lucide-react";
import { collection, query, where } from 'firebase/firestore';
import { useQuery } from "@tanstack/react-query";

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
                <Card>
                    <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">A chart from Recharts showing user sign-ups over time will be displayed here.</p>
                    </CardContent>
                </Card>
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
