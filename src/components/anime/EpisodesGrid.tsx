
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimeEpisode, AnimeInfo } from '@/lib/types/anime';
import ProgressiveImage from '../ProgressiveImage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface EpisodesGridProps {
  episodes: AnimeEpisode[];
  animeId: string;
  animePoster: string;
}

const EpisodeCard = ({ episode, animeId, animePoster }: { episode: AnimeEpisode, animeId: string, animePoster: string }) => {
  const watchUrl = `/watch/${animeId}?ep=${episode.number}`;

  return (
    <Link href={watchUrl} className="space-y-2 group">
      <div className="aspect-video w-full rounded-lg overflow-hidden relative">
        <ProgressiveImage
          src={animePoster}
          alt={`Episode ${episode.number}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
         <div className="absolute bottom-2 left-2 right-2">
             <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Ep {episode.number}</p>
             <p className="text-xs text-muted-foreground line-clamp-1">{episode.title}</p>
        </div>
      </div>
    </Link>
  );
};


export default function EpisodesGrid({ episodes, animeId, animePoster }: EpisodesGridProps) {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  // Create chunks of 100 episodes for season-like selection
  const seasonChunks: AnimeEpisode[][] = [];
  for (let i = 0; i < episodes.length; i += 100) {
    seasonChunks.push(episodes.slice(i, i + 100));
  }
  
  return (
    <section>
       <Accordion type="single" collapsible defaultValue="item-0">
        {seasonChunks.map((chunk, index) => (
             <AccordionItem value={`item-${index}`} key={index} className="border-border/50">
                 <AccordionTrigger className="text-lg font-bold hover:no-underline">
                     Season {index + 1} (Episodes {chunk[0].number} - {chunk[chunk.length-1].number})
                 </AccordionTrigger>
                 <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {chunk.map(ep => (
                            <EpisodeCard key={ep.episodeId} episode={ep} animeId={animeId} animePoster={animePoster} />
                        ))}
                    </div>
                </AccordionContent>
             </AccordionItem>
        ))}
        </Accordion>
    </section>
  );
}
