'use client';

import Link from 'next/link';
import { MoreHorizontal, Play, Check } from 'lucide-react';
import ProgressiveImage from '@/components/ProgressiveImage';
import { AnimeBase } from '@/lib/types/anime';
import ProgressRing from '@/components/ui/ProgressRing';
import { WatchlistStatus } from '@/lib/types/watchlist';

interface WatchlistCardProps {
  anime: AnimeBase & { progress: { watched: number; total: number } };
  status: WatchlistStatus;
}

export default function WatchlistCard({ anime, status }: WatchlistCardProps) {
  const progressPercent = anime.progress.total > 0 ? (anime.progress.watched / anime.progress.total) * 100 : 0;
  const isCompleted = status === 'Completed';

  return (
    <div className="group relative w-full h-full snap-start">
      <Link href={`/anime/${anime.id}`} className="block">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-card shadow-md transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary)_/_0.3)] group-hover:-translate-y-1 border-2 border-transparent group-hover:border-primary/50">
          <ProgressiveImage
            src={anime.poster}
            alt={anime.name || 'Anime Poster'}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                <Play className="w-6 h-6 text-white fill-white" />
             </div>
          </div>
          
          <div className="absolute bottom-2 right-2 z-20">
             <ProgressRing progress={progressPercent} variant={isCompleted ? 'completed' : 'default'} />
          </div>

          <div className="absolute top-2 left-2 z-20">
              <div className="p-1.5 bg-background/70 backdrop-blur-sm rounded-full">
                  <MoreHorizontal className="w-4 h-4 text-white" />
              </div>
          </div>
        </div>
      </Link>
      <div className="mt-2 px-1">
        <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">{anime.name}</p>
        <p className="text-xs text-muted-foreground">
            {isCompleted ? 'Completed' : `Ep ${anime.progress.watched} / ${anime.progress.total || '?'}`}
        </p>
      </div>
    </div>
  );
}
