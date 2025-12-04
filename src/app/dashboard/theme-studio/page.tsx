'use client';
import { Palette } from 'lucide-react';

export default function ThemeStudioPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Palette className="w-8 h-8 text-primary" />
                Theme Studio
            </h1>
            <p className="text-muted-foreground mt-2">
                Create and share your own custom themes. This feature is coming soon!
            </p>
        </div>
    )
}