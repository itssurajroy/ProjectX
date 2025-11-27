'use client';

import { cn, extractEpisodeId } from '@/lib/utils';
import { AnimeEpisode } from '@/types/anime';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, List, Mic, Captions, Search } from 'lucide-react';
import { Input } from '../ui/input';

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
  
  const episodesPerPage = 100;
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const activeEpisodeRef = useRef<HTMLButtonElement>(null);

  const getEpisodeRange = (page: number) => {
    const start = page * episodesPerPage + 1;
    const end = Math.min((page + 1) * episodesPerPage, episodes.length);
    return `${String(start).padStart(3, '0')}-${String(end).padStart(3, '0')}`;
  }

  // Find the page that the current episode is on
  useEffect(() => {
    const currentIndex = episodes.findIndex(e => extractEpisodeId(e.episodeId) === currentEpisodeId);
    if (currentIndex !== -1) {
      setCurrentPage(Math.floor(currentIndex / episodesPerPage));
    }
  }, [currentEpisodeId, episodes, episodesPerPage]);
  
  useEffect(() => {
    if (activeEpisodeRef.current) {
      activeEpisodeRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [currentEpisodeId, currentPage]);

  const displayedEpisodes = episodes.slice(currentPage * episodesPerPage, (currentPage + 1) * episodesPerPage);

  return (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Episodes</h2>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/50 hover:text-primary">
                    <Search className='w-4 h-4 mr-1'/> Find
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-muted/50 hover:text-primary">
                    <Captions className='w-5 h-5'/>
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-muted/50 hover:text-primary">
                    <Mic className='w-5 h-5'/>
                </Button>
                 <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-muted/50 hover:text-primary">
                    <List className='w-5 h-5'/>
                </Button>
            </div>
        </div>

        <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-muted/50" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                <ChevronLeft />
            </Button>
            <Select value={String(currentPage)} onValueChange={(val) => setCurrentPage(Number(val))}>
                <SelectTrigger className="w-auto bg-transparent border-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="Select episode range" />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({length: totalPages}).map((_, i) => (
                         <SelectItem key={i} value={String(i)}>{getEpisodeRange(i)}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-muted/50" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}>
                <ChevronRight />
            </Button>
        </div>

        <ScrollArea className="h-72">
            <div className="grid grid-cols-4 gap-2 pr-4">
                {displayedEpisodes.map((ep) => {
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
