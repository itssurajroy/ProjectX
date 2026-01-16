
'use client';

import { AnimeAbout } from '@/lib/types/anime';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface InfoSidebarProps {
  moreInfo: AnimeAbout['moreInfo'];
}

export default function InfoSidebar({ moreInfo }: InfoSidebarProps) {

  return (
    <div className="bg-card p-4 rounded-lg border border-border self-start lg:sticky lg:top-20">
        <div className="space-y-3 text-sm">
            {Object.entries(moreInfo).map(([key, value]) => {
                if (!value || ['malId', 'anilistId', 'nextAiringEpisode'].includes(key) || (Array.isArray(value) && value.length === 0)) return null;
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                return (
                    <div key={key}>
                        <span className="font-semibold text-foreground/80 text-xs">{label}:</span>
                        {key === 'genres' && Array.isArray(value) ? (
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                                {value.map((genre: string) => (
                                    <Link key={genre} href={`/search?genres=${genre.toLowerCase().replace(/ /g, '-')}`} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md hover:text-primary hover:bg-accent">{genre}</Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-xs mt-0.5">{Array.isArray(value) ? value.join(', ') : value}</p>
                        )}
                    </div>
                )
            })}
        </div>
    </div>
  );
}
