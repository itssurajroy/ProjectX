
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimeEpisode } from '@/lib/types/anime';
import ProgressiveImage from '../ProgressiveImage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface EpisodesGridProps {
  episodes: AnimeEpisode[];
  animeId: string;
}

const EpisodeCard = ({ episode, animeId }: { episode: AnimeEpisode, animeId: string }) => {
  // A placeholder for episode thumbnails. In a real app, you'd get this from the API.
  const thumbnailUrl = `https://picsum.photos/seed/${animeId}-${episode.number}/400/225`;
  const watchUrl = `/watch/${animeId}?ep=${episode.number}`;

  return (
    <Link href={watchUrl} className="space-y-2 group">
      <div className="aspect-video w-full rounded-lg overflow-hidden relative">
        <ProgressiveImage
          src={thumbnailUrl}
          alt={`Episode ${episode.number}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Episode {episode.number}</p>
    </Link>
  );
};


export default function EpisodesGrid({ episodes, animeId }: EpisodesGridProps) {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  // Create chunks of 100 episodes for season-like selection
  const seasonChunks: AnimeEpisode[][] = [];
  for (let i = 0; i < episodes.length; i += 100) {
    seasonChunks.push(episodes.slice(i, i + 100));
  }

  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  const handleSeasonChange = (value: string) => {
    setSelectedSeasonIndex(parseInt(value, 10));
  };

  const currentEpisodes = seasonChunks[selectedSeasonIndex] || [];
  
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-title font-bold">Episodes</h2>
        {seasonChunks.length > 1 && (
            <Select onValueChange={handleSeasonChange} defaultValue="0">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent>
                    {seasonChunks.map((_, index) => (
                        <SelectItem key={index} value={String(index)}>
                            Season {index + 1}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
          {currentEpisodes.map(ep => (
              <EpisodeCard key={ep.episodeId} episode={ep} animeId={animeId} />
          ))}
      </div>
    </section>
  );
}
