
'use client';

import { cn, extractEpisodeId } from '@/lib/utils';
import { AnimeEpisode } from '@/types/anime';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useEffect, useRef } from 'react';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  currentEpisodeId: string | null;
  onEpisodeSelect: (episode: AnimeEpisode) => void;
}

export default function EpisodeList({
  episodes,
  currentEpisodeId,
  onEpisodeSelect
}: EpisodeListProps) {
  
  const episodesPerPage = 20;
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const activeEpisodeRef = useRef<HTMLButtonElement>(null);

  const getEpisodeRange = (page: number) => {
    const start = page * episodesPerPage + 1;
    const end = Math.min((page + 1) * episodesPerPage, episodes.length);
    return `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`;
  }

  useEffect(() => {
    if (activeEpisodeRef.current) {
      activeEpisodeRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [currentEpisodeId]);

  return (
    <div className="space-y-3">
        <Select defaultValue="0">
            <SelectTrigger className="w-full bg-muted border-border/50">
                <SelectValue placeholder="Select episode range" />
            </SelectTrigger>
            <SelectContent>
                {Array.from({length: totalPages}).map((_, i) => (
                     <SelectItem key={i} value={String(i)}>{getEpisodeRange(i)}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <ScrollArea className="h-72">
            <div className="grid grid-cols-4 gap-2 pr-4">
                {episodes.map((ep) => {
                const epId = extractEpisodeId(ep.episodeId);
                if (!epId) return null;
                const isActive = epId === currentEpisodeId;

                return (
                    <Button
                        ref={isActive ? activeEpisodeRef : null}
                        onClick={() => onEpisodeSelect(ep)}
                        key={ep.episodeId}
                        variant={isActive ? 'default' : 'secondary'}
                        size="sm"
                        className="aspect-square"
                    >
                        {ep.number}
                    </Button>
                );
                })}
            </div>
        </ScrollArea>
    </div>
  );
}
