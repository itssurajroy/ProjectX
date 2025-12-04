'use client';
import { Sparkles } from 'lucide-react';

export default function AiCuratorPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                AI Curator
            </h1>
            <p className="text-muted-foreground mt-2">
                Let our AI build the perfect playlist for you. This feature is coming soon!
            </p>
        </div>
    )
}