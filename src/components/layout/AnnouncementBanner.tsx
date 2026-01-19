'use client';

import { useDoc } from '@/firebase';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, Megaphone, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnnouncementSettings {
    enabled: boolean;
    text: string;
    type: 'info' | 'warning' | 'critical';
}

const bannerStyles = {
    info: 'bg-blue-600/90 text-white',
    warning: 'bg-amber-500/90 text-white',
    critical: 'bg-red-700/90 text-white',
};

const bannerIcons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    critical: <Megaphone className="w-5 h-5" />,
};

export default function AnnouncementBanner() {
    const { data: announcement, loading } = useDoc<AnnouncementSettings>('site_config/announcement');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (announcement && announcement.enabled && announcement.text) {
            const dismissedText = sessionStorage.getItem('announcement_dismissed_text');
            if (dismissedText !== announcement.text) {
                setIsVisible(true);
            }
        } else {
            setIsVisible(false);
        }
    }, [announcement]);

    const handleDismiss = () => {
        setIsVisible(false);
        if (announcement?.text) {
            sessionStorage.setItem('announcement_dismissed_text', announcement.text);
        }
    };

    if (!isVisible || loading || !announcement) {
        return null;
    }

    return (
        <div className={cn(
            "relative z-[60] flex items-center justify-center gap-4 px-4 py-2 text-sm text-center",
            bannerStyles[announcement.type]
        )}>
            <div className="flex-shrink-0">{bannerIcons[announcement.type]}</div>
            <p className="font-medium flex-1 text-center">{announcement.text}</p>
            <button onClick={handleDismiss} className="p-1 rounded-md hover:bg-white/20">
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}