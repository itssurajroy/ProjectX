'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { UserProfile } from "@/lib/types/user";
import { Report } from "@/lib/types/report";
import { Activity, Users, Film, Loader2, Flag, AlertTriangle, PlusCircle, History, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { ActivityLogItem } from "@/lib/types/activity";
import { AnimeService } from "@/lib/services/AnimeService";
import { HomeData, Top10Anime } from "@/lib/types/anime";
import ProgressiveImage from "@/components/ProgressiveImage";

const activityIcons: Record<ActivityLogItem['type'], React.ReactNode> = {
    new_user: <Users className="w-4 h-4 text-green-500" />,
    new_comment: <MessageSquare className="w-4 h-4 text-blue-500" />,
    new_report: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    update_user_role: <History className="w-4 h-4 text-orange-500" />,
};

const RecentActivityItem = ({ activity }: { activity: ActivityLogItem }) => (
    <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-1">
            {activityIcons[activity.type] || <Activity className="w-4 h-4" />}
        </span>
        <div className="flex-1">
            <p className="text-sm">
                <Link href={`/admin/users?q=${activity.username}`} className="font-semibold hover:underline">{activity.username || 'System'}</Link>
                {' '}{activity.details.summary}
            </p>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                <span>{activity.timestamp ? formatDistanceToNow(activity.timestamp.toDate(), { addSuffix: true }) : '...'}</span>
                {activity.details.link && (
                    <Button variant="link" asChild className="p-0 h-auto text-xs">
                        <Link href={activity.details.link}>View Details</Link>
                    </Button>
                )}
            </div>
        </div>
    </div>
);


export default function AdminDashboardPage() {
    const { data: users, loading: loadingUsers } = useCollection<UserProfile>('users');
    const { data: reports, loading: loadingReports } = useCollection<Report>('reports');
    const { data: activities, loading: loadingActivities } = useCollection<ActivityLogItem>('activity_log');
    
    const { data: homeData, isLoading: loadingHomeData } = useQuery<HomeData>({
        queryKey: ['homeDataForAdmin'],
        queryFn: AnimeService.home
    });

    const pendingReportsCount = useMemo(() => {
        if (!reports) return 0;
        return reports.filter(r => r.status === 'Pending').length;
    }, [reports]);

    const kpiData = [
        { title: "Total Users", value: loadingUsers ? <Loader2 className="w-5 h-5 animate-spin" /> : users?.length.toLocaleString() || '0', icon: Users, href: "/admin/users" },
        { title: "Total Anime", value: loadingHomeData ? <Loader2 className="w-5 h-5 animate-spin" /> : '2150+', icon: Film, href: "/admin/anime" }, // The API does not provide a total count.
        { title: "Pending Reports", value: loadingReports ? <Loader2 className="w-5 h-5 animate-spin" /> : pendingReportsCount, icon: Flag, href: "/admin/moderation" },
        { title: "Recent Activity", value: loadingActivities ? <Loader2 className="w-5 h-5 animate-spin" /> : activities?.length.toLocaleString() || '0', icon: Activity, href: "/admin/activity-log" },
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
    
    const topAnime: Top10Anime[] = homeData?.top10Animes?.week || [];
    const sortedActivities = activities?.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));


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
                     <Card key={kpi.title} className="hover:bg-muted/50 transition-colors">
                        <Link href={kpi.href}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2">
                    {loadingUsers ? (
                        <Card>
                            <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
                            <CardContent className="h-[450px] flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </CardContent>
                        </Card>
                    ) : (
                        <UserGrowthChart data={userGrowthData} />
                    )}
                </div>
                <div className="lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle>Top Watched This Week</CardTitle>
                            <CardDescription>Most streamed this week.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {loadingHomeData ? (
                                <div className="flex justify-center items-center h-40"><Loader2 className="w-6 h-6 animate-spin"/></div>
                            ) : topAnime.slice(0, 5).map(anime => (
                                <div key={anime.id} className="flex items-center gap-3 group">
                                    <div className="relative w-12 h-16 flex-shrink-0">
                                        <ProgressiveImage src={anime.poster} alt={anime.name} fill className="object-cover rounded-md" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <Link href={`/anime/${anime.id}`} className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{anime.name}</Link>
                                        <p className="text-xs text-muted-foreground">{anime.episodes?.sub || '?'} episodes</p>
                                    </div>
                                    <div className="font-bold text-lg text-muted-foreground/50 w-8 text-right">#{anime.rank}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
             <div className="grid grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>A stream of the latest events on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {loadingActivities ? (
                            <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 animate-spin"/></div>
                        ) : sortedActivities && sortedActivities.length > 0 ? (
                            sortedActivities.slice(0, 5).map(activity => (
                                <RecentActivityItem key={activity.id} activity={activity} />
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-10">No recent activity.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
