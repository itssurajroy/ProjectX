'use client';
import { Trophy } from 'lucide-react';

export default function AchievementsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                Achievements
            </h1>
            <p className="text-muted-foreground mt-2">
                Unlock badges and show off your progress. This feature is coming soon!
            </p>
        </div>
    )
}