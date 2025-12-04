'use client';
import { PartyPopper } from 'lucide-react';

export default function WatchPartiesPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <PartyPopper className="w-8 h-8 text-primary" />
                Watch Parties
            </h1>
            <p className="text-muted-foreground mt-2">
                Manage your watch parties. This feature is coming soon!
            </p>
        </div>
    )
}