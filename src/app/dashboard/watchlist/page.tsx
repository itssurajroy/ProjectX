'use client';
import { Bookmark } from 'lucide-react';

export default function WatchlistPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bookmark className="w-8 h-8 text-primary" />
                Watchlist
            </h1>
            <p className="text-muted-foreground mt-2">
                This is where your saved anime will appear. This feature is coming soon!
            </p>
        </div>
    )
}