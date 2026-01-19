
'use client';
import { useCollection } from "@/firebase";
import { ActivityLogItem } from "@/lib/types/activity";
import { Loader2, UserPlus, MessageSquare, AlertTriangle, ListPlus, Edit, FilePlus, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const activityIcons: Record<ActivityLogItem['type'], React.ReactNode> = {
    new_user: <UserPlus className="w-4 h-4 text-green-500" />,
    new_comment: <MessageSquare className="w-4 h-4 text-blue-500" />,
    new_report: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    update_user_role: <Edit className="w-4 h-4 text-orange-500" />,
    // Add other icons as you implement more activity types
    // new_watchlist_item: <ListPlus className="w-4 h-4 text-purple-500" />,
    // new_blog_post: <FilePlus className="w-4 h-4 text-indigo-500" />,
    // new_page: <FilePlus className="w-4 h-4 text-teal-500" />,
};


export default function AdminActivityLogPage() {
    const { data: activities, loading, error } = useCollection<ActivityLogItem>('activity_log');

    const sortedActivities = activities?.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><History className="w-8 h-8"/> Activity Log</h1>
                <p className="text-muted-foreground">A real-time stream of important events happening on the platform.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Showing the last 50 activities.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>
                    ) : error ? (
                        <div className="text-center text-destructive">Error: {error.message}</div>
                    ) : sortedActivities && sortedActivities.length > 0 ? (
                        <div className="space-y-4">
                            {sortedActivities.slice(0, 50).map(activity => (
                                <div key={activity.id} className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                            {activityIcons[activity.type] || <UserPlus className="w-4 h-4" />}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={activity.userAvatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${activity.userId}`} />
                                                <AvatarFallback>{activity.username?.[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm">
                                                <span className="font-semibold">{activity.username || 'System'}</span>
                                                {' '}{activity.details.summary}
                                            </p>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                                            <span>{activity.timestamp ? formatDistanceToNow(activity.timestamp.toDate(), { addSuffix: true }) : '...'}</span>
                                            {activity.details.link && (
                                                <Button variant="link" asChild className="p-0 h-auto">
                                                    <Link href={activity.details.link}>View Details</Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">No activities logged yet.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
