
'use client';

import { AnimeAbout } from '@/lib/types/anime';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface InfoSidebarProps {
  moreInfo: AnimeAbout['moreInfo'];
}

export default function InfoSidebar({ moreInfo }: InfoSidebarProps) {

  return (
    <div className="bg-card p-4 rounded-xl border border-border self-start sticky top-20">
        <div className="space-y-3 text-sm">
            {Object.entries(moreInfo).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                
                return (
                    <div key={key} className="flex justify-between border-b border-border/50 pb-2 last:border-b-0">
                    <span className="font-bold text-foreground/80">{label}:</span>
                    {key === 'genres' && Array.isArray(value) ? (
                        <div className="flex flex-wrap items-center justify-end gap-1 max-w-[60%]">
                            {value.map((genre: string) => (
                                <Link key={genre} href={`/search?genres=${genre.toLowerCase().replace(/ /g, '-')}`} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md hover:text-primary hover:bg-muted/50">{genre}</Link>
                            ))}
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-right">{Array.isArray(value) ? value.join(', ') : value}</span>
                    )}
                    </div>
                )
            })}
        </div>
    </div>
  );
}
