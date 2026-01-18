
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { UserProfile } from "@/lib/types/user";
import { Report } from "@/lib/types/report";
import { Activity, Users, Film, Loader2, Flag, AlertTriangle, PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format } from "date-fns";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function AdminDashboardPage() {
    const { data: users, loading: loadingUsers } = useCollection<UserProfile>('users');
    const { data: reports, loading: loadingReports } = useCollection<Report>('reports');
    
    // This is a placeholder. In a real app, this would query an 'animes' collection.
    const { data: animeCount, isLoading: loadingAnimeCount } = useQuery({
        queryKey: ['animeCount'],
        queryFn: async () => { 
            return 2150; // Static for now
        },
    });

    const pendingReportsCount = useMemo(() => {
        if (!reports) return 0;
        return reports.filter(r => r.status === 'Pending').length;
    }, [reports]);

    const kpiData = [
        { title: "Total Users", value: loadingUsers ? <Loader2 className="w-5 h-5 animate-spin" /> : users?.length.toLocaleString() || '0', icon: Users },
        { title: "Total Anime", value: loadingAnimeCount ? <Loader2 className="w-5 h-5 animate-spin" /> : animeCount?.toLocaleString() || '0', icon: Film },
        { title: "Online Users", value: 73, icon: Activity },
        { title: "Pending Reports", value: loadingReports ? <Loader2 className="w-5 h-5 animate-spin" /> : pendingReportsCount, icon: Flag },
    ];

    const userGrowthData = useMemo(() => {
        if (!users) return [];
        
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
    
        return Object.values(dailyCounts)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(-30)
            .map(item => ({
                date: format(item.date, 'MMM dd'),
                users: item.count,
            }));
    
    }, [users]);
    
    const topAnime = [
        { name: "Jujutsu Kaisen", plays: "1,204" },
        { name: "One Piece", plays: "987" },
        { name: "Attack on Titan", plays: "856" },
        { name: "Frieren: Beyond Journey's End", plays: "781" },
        { name: "Solo Leveling", plays: "752" },
    ];


    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">At-a-glance overview of the platform's health.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/admin/anime"><PlusCircle className="w-4 h-4 mr-2" /> Add Anime</Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/admin/moderation"><Flag className="w-4 h-4 mr-2" /> Review Reports</Link>
                    </Button>
                </div>
            </div>

             <Alert variant="destructive" className="bg-amber-600/10 border-amber-500/50 text-amber-500 [&>svg]:text-amber-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-amber-400 font-bold">System Warning</AlertTitle>
                <AlertDescription>
                    Streaming source "HD-2" is reporting high latency. Performance may be degraded.
                </AlertDescription>
            </Alert>


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

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                 <div className="lg:col-span-5">
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
                </div>
                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle>Top Watched Anime</CardTitle>
                            <CardDescription>Most streamed this week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-sm">
                                {topAnime.map(anime => (
                                    <div key={anime.name} className="flex justify-between items-center">
                                        <span className="font-medium truncate pr-4">{anime.name}</span>
                                        <span className="text-muted-foreground font-mono text-xs">{anime.plays}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
