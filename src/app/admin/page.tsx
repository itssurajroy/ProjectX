'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase/client/useCollection";
import { UserProfile } from "@/lib/types/user";
import { Activity, Users, Film, BarChart, Loader2 } from "lucide-react";
import { collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function AdminDashboardPage() {
    const { data: users, loading: loadingUsers } = useCollection<UserProfile>('users');
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsersQuery = query(collection(db, 'users'), where('createdAt', '>=', twentyFourHoursAgo));
    const { data: newUsers, loading: loadingNewUsers } = useCollection<UserProfile>('users', newUsersQuery);

    const kpiData = [
        { title: "Total Users", value: loadingUsers ? <Loader2 className="w-5 h-5 animate-spin" /> : users?.length.toLocaleString() || '0', icon: Users },
        { title: "New Users (24h)", value: loadingNewUsers ? <Loader2 className="w-5 h-5 animate-spin" /> : newUsers?.length.toLocaleString() || '0', icon: Activity },
        { title: "Total Anime", value: "2,150", icon: Film },
        { title: "Total Views (24h)", value: "150,923", icon: BarChart },
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
                    <CardHeader><CardTitle>Top Anime</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Most added, highest rated, and most reviewed anime will be displayed here.</p>
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
