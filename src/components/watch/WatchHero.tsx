
'use client';

import Image from 'next/image';
import { AnimeInfo } from '@/types/anime';
import Link from 'next/link';
import { Home, Tv } from 'lucide-react';
import Breadcrumb from '../common/Breadcrumb';

interface WatchHeroProps {
  animeInfo: AnimeInfo;
}

export default function WatchHero({ animeInfo }: WatchHeroProps) {
  return (
    <div className="relative w-full">
      {/* Full Blurred Background */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src={animeInfo.poster}
          alt={`${animeInfo.name} background`}
          fill
          className="object-cover object-center opacity-10 blur-xl"
          priority
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <Breadcrumb items={[
            { label: 'Home', href: '/home' },
            { label: animeInfo.stats.type, href: `/search?type=${animeInfo.stats.type}` },
            { label: animeInfo.name, href: `/anime/${animeInfo.id}` },
            { label: 'Watch' }
        ]} />
        <div className="mt-4 flex items-start gap-6">
            {/* Lifted Poster */}
            <div className="hidden md:block flex-shrink-0">
                 <div className="relative aspect-[2/3] w-32 rounded-lg overflow-hidden shadow-lg shadow-primary/20 border border-primary/20">
                    <Image 
                        src={animeInfo.poster} 
                        alt={animeInfo.name} 
                        fill 
                        className="object-cover" 
                    />
                </div>
            </div>
            {/* Title & Info */}
            <div>
                 <h1 className="text-2xl md:text-3xl font-bold text-glow font-display">{animeInfo.name}</h1>
                 <p className="text-sm text-muted-foreground mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: animeInfo.description }} />
            </div>
        </div>
      </div>
    </div>
  );
}
