'use client';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="w-8 h-8 text-primary" />
                Notifications
            </h1>
            <p className="text-muted-foreground mt-2">
                See all your updates in one place. This feature is coming soon!
            </p>
        </div>
    )
}