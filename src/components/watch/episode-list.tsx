'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimeEpisode } from '@/types/anime';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Grid, List, Loader2, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '../ui/input';

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

  const episodeChunks = [];
  for (let i = 0; i < episodes.length; i += 100) {
      episodeChunks.push(episodes.slice(i, i + 100));
  }
  const [currentChunkIndex, setCurrentChunkIndex] = useState(
    episodes.findIndex(ep => String(ep.number) === currentEpisodeId || ep.episodeId === currentEpisodeId) / 100 | 0
  );

  const filteredEpisodes = (episodeChunks[currentChunkIndex] || [])
    .filter(ep => ep.number.toString().includes(search))
    .sort((a, b) => (sort === 'asc' ? a.number - b.number : b.number - a.number));

  return (
    <div className="bg-card rounded-lg p-3 border border-border/50 sticky top-20">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">List of episodes</h2>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Grid className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="flex gap-2 mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 justify-between">
                    Eps: {currentChunkIndex * 100 + 1} - {(currentChunkIndex + 1) * 100}
                    <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
                {episodeChunks.map((_, index) => (
                    <DropdownMenuItem key={index} onSelect={() => setCurrentChunkIndex(index)}>
                        Eps: {index * 100 + 1} - {(index + 1) * 100}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
         <div className="relative">
             <Input
                type="number"
                placeholder="Number of Ep"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pr-8"
             />
             <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
         </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-320px)] pr-3">
        <div className="grid grid-cols-5 gap-2">
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
