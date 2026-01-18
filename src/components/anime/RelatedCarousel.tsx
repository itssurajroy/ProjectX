
'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { AnimeBase } from '@/lib/types/anime';
import { AnimeCard } from '@/components/AnimeCard';

interface RelatedCarouselProps {
  title: string;
  animes: AnimeBase[];
}

export default function RelatedCarousel({ title, animes }: RelatedCarouselProps) {
  if (!animes || animes.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: animes.length > 7,
        }}
        className="w-full"
      >
        <CarouselContent>
          {animes.map((anime) => (
            <CarouselItem key={anime.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/7">
              <AnimeCard anime={anime} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-card/80 hover:bg-card hidden sm:flex" />
        <CarouselNext className="right-2 bg-card/80 hover:bg-card hidden sm:flex" />
      </Carousel>
    </section>
  );
}

