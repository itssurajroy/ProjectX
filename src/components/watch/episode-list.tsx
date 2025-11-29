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
  const [filterType, setFilterType] = useState('all');

  const activeEpisodeRef = useRef<HTMLButtonElement>(null);

  const getEpisodeRange = (page: number) => {
    const start = page * episodesPerPage + 1;
    const end = Math.min((page + 1) * episodesPerPage, episodes.length);
    return `${String(start).padStart(3, '0')}-${String(end).padStart(3, '0')}`;
  }

  // Find the page that the current episode is on
  useEffect(() => {
    const currentIndex = episodes.findIndex(e => String(e.number) === currentEpisodeId);
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
    <div className="space-y-3 bg-card border border-border/50 rounded-lg p-3 sticky top-20">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Episodes</h2>
            <div className="flex items-center gap-1">
                 <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-muted/50 hover:text-primary" title="Find Episode">
                    <Search className='w-4 h-4'/>
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-muted/50 hover:text-primary" title="Subtitles">
                    <Captions className='w-4 h-4'/>
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-muted/50 hover:text-primary" title="Audio">
                    <Mic className='w-4 h-4'/>
                </Button>
            </div>
        </div>

        <div className="flex items-center justify-between bg-background p-1 rounded-md">
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:bg-muted/50" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                <ChevronLeft className="w-5 h-5"/>
            </Button>
            <Select value={String(currentPage)} onValueChange={(val) => setCurrentPage(Number(val))}>
                <SelectTrigger className="w-auto bg-transparent border-0 shadow-none focus:ring-0 text-xs h-auto py-1">
                    <SelectValue placeholder="Select episode range" />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({length: totalPages}).map((_, i) => (
                         <SelectItem key={i} value={String(i)}>{getEpisodeRange(i)}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:bg-muted/50" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}>
                <ChevronRight className="w-5 h-5"/>
            </Button>
        </div>

        <ScrollArea className="h-72">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-1.5 pr-3">
                {displayedEpisodes.map((ep) => {
                const epNum = String(ep.number);
                if (!epNum) return null;
                const isActive = epNum === currentEpisodeId;

                return (
                    <Button
                        ref={isActive ? activeEpisodeRef : null}
                        onClick={() => onEpisodeSelect(ep)}
                        key={ep.episodeId}
                        variant={isActive ? 'default' : 'secondary'}
                        size="sm"
                        className={cn("aspect-square h-auto", isActive ? "bg-primary" : "bg-muted hover:bg-muted/80")}
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
