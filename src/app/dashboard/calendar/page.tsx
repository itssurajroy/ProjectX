'use client';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                Airing Calendar
            </h1>
            <p className="text-muted-foreground mt-2">
                See the schedule for all your favorite shows. This feature is coming soon!
            </p>
        </div>
    )
}