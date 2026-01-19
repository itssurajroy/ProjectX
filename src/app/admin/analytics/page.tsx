
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { UserProfile } from "@/lib/types/user";
import { useMemo } from "react";
import { format } from "date-fns";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlayCircle, Users, Clock, CheckCircle, Download, Calendar, Loader2 } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/services/AnimeService";
import { HomeData } from "@/lib/types/anime";


export default function AdminAnalyticsPage() {
    const { data: users, loading: loadingUsers } = useCollection<UserProfile>('users');

    const { data: homeData, isLoading: isLoadingHomeData } = useQuery<HomeData>({
        queryKey: ['homeDataForAdmin'],
        queryFn: AnimeService.home
    });

    const topAnime = homeData?.mostPopularAnimes || [];

    const kpiData = [
        { title: "Total Plays", value: "1.2M", change: "+5.2%", icon: PlayCircle, loading: false },
        { title: "Unique Viewers", value: users?.length.toLocaleString() ?? '0', change: null, icon: Users, loading: loadingUsers },
        { title: "Avg. Watch Time", value: "24m 12s", change: "-2.1%", icon: Clock, loading: false },
        { title: "Completion Rate", value: "78.3%", change: "+0.5%", icon: CheckCircle, loading: false },
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


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Platform-wide insights on content, users, and streaming health.</p>
            </div>

            <Card className="bg-card/30">
                 <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                        <Select defaultValue="30d">
                            <SelectTrigger className="w-[180px] bg-background">
                                <SelectValue placeholder="Date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">Last 24 hours</SelectItem>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                                <SelectItem value="90d">Last 90 days</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select defaultValue="all">
                            <SelectTrigger className="w-[180px] bg-background">
                                <SelectValue placeholder="Region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="na">North America</SelectItem>
                                <SelectItem value="eu">Europe</SelectItem>
                                <SelectItem value="as">Asia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:ml-auto flex items-center gap-2">
                         <Button variant="outline" className="gap-2 bg-background"><Calendar className="w-4 h-4"/> Compare</Button>
                         <Button className="gap-2"><Download className="w-4 h-4"/> Export Data</Button>
                    </div>
                </CardContent>
            </Card>

             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map(kpi => (
                     <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {kpi.loading ? <Loader2 className="w-6 h-6 animate-spin" /> : kpi.value}
                            </div>
                            {kpi.change && <p className="text-xs text-muted-foreground">{kpi.change} vs last period</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                 <div className="lg:col-span-3">
                    <UserGrowthChart data={userGrowthData} />
                </div>
                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle>Top Watched Content</CardTitle>
                            <CardDescription>Most popular anime this period.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {isLoadingHomeData ? (
                                <div className="flex justify-center items-center h-40"><Loader2 className="w-6 h-6 animate-spin"/></div>
                           ) : (
                               <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Anime</TableHead>
                                            <TableHead className="text-right">Rank</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topAnime.slice(0, 5).map(anime => (
                                            <TableRow key={anime.name}>
                                                <TableCell className="font-medium">{anime.name}</TableCell>
                                                <TableCell className="text-right font-mono text-sm">{anime.rank}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}
