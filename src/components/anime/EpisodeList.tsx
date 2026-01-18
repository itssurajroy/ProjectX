
'use client';
import { useState } from 'react';
import { AnimeEpisode } from '@/lib/types/anime';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Grid, List, ChevronsUpDown } from 'lucide-react';
import EpisodeCard from './EpisodeCard';
import { useSearchParams } from 'next/navigation';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  animeId: string;
}

export default function EpisodeList({ episodes, animeId }: EpisodeListProps) {
  const searchParams = useSearchParams();
  const currentEp = searchParams.get('ep');
  const [server, setServer] = useState('HD-1');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!episodes || episodes.length === 0) {
    return (
      <div className="p-4 bg-card rounded-lg">
        <h2 className="text-lg font-bold">Episodes</h2>
        <p className="text-muted-foreground mt-4 text-center">No episodes available yet.</p>
      </div>
    );
  }
  
  return (
    <div id="episodes" className="scroll-mt-20">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Episodes</h2>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Server:</span>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                {server} <ChevronsUpDown className="w-4 h-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setServer('HD-1')}>HD-1</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setServer('HD-2')}>HD-2</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="w-5 h-5"/> : <Grid className="w-5 h-5"/>}
            </Button>
        </div>
      </div>

      <ScrollArea className="h-[400px] w-full bg-card/30 p-4 rounded-lg">
        {viewMode === 'grid' ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {episodes.map((ep) => (
                    <EpisodeCard
                        key={ep.episodeId}
                        episode={ep}
                        animeId={animeId}
                        isActive={String(ep.number) === currentEp}
                    />
                ))}
             </div>
        ) : (
            <div className="space-y-2">
                {episodes.map((ep) => (
                    <EpisodeCard
                        key={ep.episodeId}
                        episode={ep}
                        animeId={animeId}
                        isActive={String(ep.number) === currentEp}
                    />
                ))}
            </div>
        )}
      </ScrollArea>
    </div>
  );
}

