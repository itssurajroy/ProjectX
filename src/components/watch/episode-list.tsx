'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimeEpisode } from '@/types/anime';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  currentEpisodeId: string | null;
  onEpisodeSelect: (episode: AnimeEpisode) => void;
}

export default function EpisodeList({ episodes, currentEpisodeId, onEpisodeSelect }: EpisodeListProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  if (!episodes || episodes.length === 0) {
    return (
      <div className="bg-card rounded-lg p-4 border border-border/50 h-full">
        <h2 className="text-lg font-bold mb-4">Episodes</h2>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const filteredEpisodes = episodes
    .filter(ep => ep.number.toString().includes(search))
    .sort((a, b) => (sort === 'asc' ? a.number - b.number : b.number - a.number));

  return (
    <div className="bg-card rounded-lg p-3 border border-border/50 sticky top-20">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Episodes</h2>
        <Button variant="ghost" size="sm" onClick={() => setSort(s => (s === 'asc' ? 'desc' : 'asc'))}>
          <ChevronsUpDown className="w-4 h-4 mr-1" />
          {sort === 'asc' ? 'Newest' : 'Oldest'}
        </Button>
      </div>
      <input
        type="text"
        placeholder={`Search (1 - ${episodes.length})`}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-muted/50 rounded-md px-3 py-2 text-sm mb-3 border-transparent focus:border-primary focus:ring-primary"
      />
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="grid grid-cols-4 gap-2">
          {filteredEpisodes.map(ep => (
            <button
              key={ep.episodeId}
              onClick={() => onEpisodeSelect(ep)}
              className={cn(
                'p-2 text-center text-sm font-medium rounded-md truncate',
                (currentEpisodeId === String(ep.number) || currentEpisodeId === ep.episodeId)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 hover:bg-muted'
              )}
              title={`Episode ${ep.number}`}
            >
              {ep.number}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
