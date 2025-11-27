'use client';

import { cn, extractEpisodeId } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { AnimeEpisode } from '@/types/anime';
import { ScrollArea } from '../ui/scroll-area';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  currentEpisodeId: string | null;
  loading: boolean;
  onEpisodeSelect: (episode: AnimeEpisode) => void;
}

export default function EpisodeList({
  episodes,
  currentEpisodeId,
  loading,
  onEpisodeSelect
}: EpisodeListProps) {
  if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
  }
  
  return (
    <ScrollArea className="h-96">
      <div className="space-y-2 pr-4">
        {episodes.map((ep) => {
          const epId = extractEpisodeId(ep.episodeId);
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
    </ScrollArea>
  );
}

    