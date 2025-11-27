'use client';

import { cn, extractEpisodeId } from '@/lib/utils';
import { AnimeEpisode } from '@/types/anime';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

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

  const getEpisodeRange = (page: number) => {
    const start = page * episodesPerPage + 1;
    const end = Math.min((page + 1) * episodesPerPage, episodes.length);
    return `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`;
  }

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
        <div className="grid grid-cols-5 gap-2">
            {episodes.map((ep) => {
            const epId = extractEpisodeId(ep.episodeId);
            if (!epId) return null;

            return (
                <Button
                    onClick={() => onEpisodeSelect(ep)}
                    key={ep.episodeId}
                    variant={epId === currentEpisodeId ? 'default' : 'secondary'}
                    size="sm"
                    className="aspect-square"
                >
                    {ep.number}
                </Button>
            );
            })}
        </div>
    </div>
  );
}
