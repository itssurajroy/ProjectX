
'use client';
import { useNotifications } from '@/components/notifications/NotificationProvider';
import { Bell, CheckCheck, CircleDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Bell className="w-8 h-8 text-primary" />
                    Notifications
                </h1>
                {unreadCount > 0 && (
                     <Button onClick={markAllAsRead} size="sm" variant="outline" className="gap-2">
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <Link href={notif.link || '#'} key={notif.id} className="block">
                            <div className={cn(
                                "p-4 rounded-lg border flex items-start gap-4 transition-colors",
                                !notif.read 
                                    ? "bg-primary/10 border-primary/20 hover:bg-primary/20"
                                    : "bg-card/50 border-border/50 hover:bg-muted"
                            )}>
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                      {notif.icon || '★'}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">{notif.title}</p>
                                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                                    {notif.createdAt && (
                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                            {formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })}
                                        </p>
                                    )}
                                </div>
                                {!notif.read && (
                                    <div className="w-2.5 h-2.5 mt-1.5 bg-primary rounded-full" title="Unread"></div>
                                )}
                            </div>
                        </Link>
                    ))
                ) : (
                     <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                        <CircleDashed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-lg">All caught up!</h3>
                        <p className="text-muted-foreground text-sm">You have no new notifications.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
