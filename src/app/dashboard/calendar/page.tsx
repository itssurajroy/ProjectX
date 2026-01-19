
'use client';
import { Calendar, Frown } from 'lucide-react';

export default function DisabledCalendarPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-primary" />
                Airing Calendar
            </h1>
            <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                <Frown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold">Feature Temporarily Disabled</h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    The Airing Calendar is currently unavailable due to technical issues with our data provider. We are working to restore it as soon as possible.
                </p>
            </div>
        </div>
    );
}
