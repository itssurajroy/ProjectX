'use client';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary" />
                Settings
            </h1>
            <p className="text-muted-foreground mt-2">
                Customize your Project X experience. This feature is coming soon!
            </p>
        </div>
    )
}