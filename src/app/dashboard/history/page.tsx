'use client';
import { History } from 'lucide-react';

export default function HistoryPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <History className="w-8 h-8 text-primary" />
                Watch History
            </h1>
            <p className="text-muted-foreground mt-2">
                Track all the anime you've watched. This feature is coming soon!
            </p>
        </div>
    )
}