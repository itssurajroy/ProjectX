
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { AnimeEpisode } from '@/types/anime';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  currentEpisodeId: string | undefined;
  animeId: string;
  loading: boolean;
  onEpisodeSelect: (episode: AnimeEpisode) => void;
}

export default function EpisodeList({
  episodes,
  currentEpisodeId,
  animeId,
  loading,
  onEpisodeSelect
}: EpisodeListProps) {
  return (
    <div className="space-y-6 sticky top-20">
      <div className="bg-card/50 p-4 rounded-lg border border-border">
        <h2 className="text-lg font-bold mb-3">Up Next 🍿</h2>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {episodes.map((ep, index) => {
              const epId = ep.episodeId;
              if (!epId) return null;

              return (
                <button
                  onClick={() => onEpisodeSelect(ep)}
                  key={ep.episodeId}
                  className={cn(
                    'block w-full text-left p-2.5 rounded-md transition-colors',
                    epId === currentEpisodeId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  )}
                >
                  <p className="font-semibold text-sm truncate">
                    Episode {ep.number}
                    {ep.isFiller && <span className="text-xs text-orange-400 ml-2">(Filler)</span>}
                  </p>
                  <p className={cn("text-xs truncate", epId === currentEpisodeId ? 'text-primary-foreground/80' : 'text-muted-foreground/80')}>{ep.title}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
    </div>
  );
}
