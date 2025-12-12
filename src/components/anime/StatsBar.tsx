
'use client';

import { Badge } from '@/components/ui/badge';
import { Star, Tv, Clapperboard, Clock, Shield } from 'lucide-react';
import { AnimeInfo } from '@/lib/types/anime';

interface StatsBarProps {
  stats: AnimeInfo['stats'];
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      {stats.rating && (
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-amber-400" />
          <span>{stats.rating}</span>
        </div>
      )}
      {stats.quality && (
        <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
          {stats.quality}
        </Badge>
      )}
      <div className="flex items-center gap-1.5">
        <Tv className="h-4 w-4" />
        <span>{stats.type}</span>
      </div>
      {stats.episodes.sub && (
        <div className="flex items-center gap-1.5">
          <Clapperboard className="h-4 w-4" />
          <span>SUB {stats.episodes.sub}</span>
        </div>
      )}
      {stats.episodes.dub && (
        <div className="flex items-center gap-1.5">
          <Clapperboard className="h-4 w-4" />
          <span>DUB {stats.episodes.dub}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        <span>{stats.duration}</span>
      </div>
    </div>
  );
}
