'use client';
import { Download } from 'lucide-react';

export default function DownloadsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Download className="w-8 h-8 text-primary" />
                Offline Downloads
            </h1>
            <p className="text-muted-foreground mt-2">
                Manage your downloaded episodes for offline viewing. This feature is coming soon!
            </p>
        </div>
    )
}