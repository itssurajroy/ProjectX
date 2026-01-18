
'use client';
import { AnimeInfo, AnimeAbout } from '@/lib/types/anime';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Bookmark, Star, Tv, Clock } from 'lucide-react';
import Link from 'next/link';
import ProgressiveImage from '@/components/ProgressiveImage';

interface AnimeHeroProps {
  anime: AnimeInfo;
  moreInfo: AnimeAbout['moreInfo'];
}

export default function AnimeHero({ anime, moreInfo }: AnimeHeroProps) {
  return (
    <div className="relative pt-20">
      <div className="absolute inset-0 h-[60vh] xl:h-[70vh] overflow-hidden">
        <ProgressiveImage
          src={anime.poster}
          alt={anime.name}
          fill
          priority
          className="object-cover object-top opacity-10 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end py-8">
        <div className="md:col-span-3">
          <ProgressiveImage
            src={anime.poster}
            alt={anime.name}
            width={250}
            height={380}
            className="rounded-lg shadow-2xl w-48 md:w-full mx-auto"
          />
        </div>
        <div className="md:col-span-9 space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold font-display text-glow">
            {anime.name}
          </h1>
          {moreInfo.japanese && (
            <h2 className="text-lg text-muted-foreground font-medium">
              {moreInfo.japanese}
            </h2>
          )}
          <div
            className="text-sm text-muted-foreground line-clamp-3 max-w-3xl mx-auto md:mx-0"
            dangerouslySetInnerHTML={{ __html: anime.description }}
          />
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm">
            {moreInfo.malscore && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>{moreInfo.malscore}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Tv className="w-4 h-4" />
              <span>{anime.stats.type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{anime.stats.duration}</span>
            </div>
            <Badge variant="secondary">{moreInfo.status}</Badge>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {moreInfo.genres?.map((genre: string) => (
              <Badge key={genre} variant="outline" className="bg-card/50">
                {genre}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4 pt-4 justify-center md:justify-start">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30">
              <Link href={`#episodes`}>
                <Play className="w-5 h-5 mr-2" /> Watch Now
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="bg-card/80">
              <Bookmark className="w-5 h-5 mr-2" /> Add to List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

