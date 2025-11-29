
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Bookmark, Play } from 'lucide-react';
import { AnimeInfo } from '@/types/anime';
import Link from 'next/link';
import StatsBar from './StatsBar';

interface AnimeHeroProps {
  animeInfo: AnimeInfo;
  animeId: string;
}

export default function AnimeHero({ animeInfo, animeId }: AnimeHeroProps) {
  return (
    <div className="relative w-full">
      {/* Blurred Background Banner */}
      <div className="absolute inset-x-0 top-0 h-[40vh] w-full">
        <Image
          src={animeInfo.poster}
          alt={`${animeInfo.name} background`}
          fill
          className="object-cover object-top opacity-20 blur-md"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-[15vh] pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Lifted Poster */}
          <div className="md:col-span-3">
            <div className="relative aspect-[2/3] w-full max-w-[250px] mx-auto md:mx-0 rounded-lg overflow-hidden shadow-2xl shadow-primary/20 border-2 border-primary/30">
              <Image 
                src={animeInfo.poster} 
                alt={animeInfo.name} 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="mt-4 flex flex-col gap-2 max-w-[250px] mx-auto md:mx-0">
                <Button asChild size="lg" className="w-full">
                    <Link href={`/watch/${animeId}`}>
                        <Play className="mr-2 h-5 w-5" /> Watch Now
                    </Link>
                </Button>
                 <Button variant="secondary" size="lg" className="w-full">
                    <Bookmark className="mr-2 h-5 w-5" /> Add to List
                </Button>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-9 flex flex-col justify-end">
            <h1 className="text-3xl md:text-5xl font-bold text-glow font-display">{animeInfo.name}</h1>
            <div className="mt-4">
              <StatsBar stats={animeInfo.stats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
