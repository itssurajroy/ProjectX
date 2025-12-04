'use client';
import { BarChart3 } from 'lucide-react';

export default function StatsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                Statistics
            </h1>
            <p className="text-muted-foreground mt-2">
                Detailed statistics about your watching habits are coming soon!
            </p>
        </div>
    )
}