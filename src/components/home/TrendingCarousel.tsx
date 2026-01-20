'use client';
import { Top10Anime } from '@/lib/types/anime';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from 'next/link';
import ProgressiveImage from '../ProgressiveImage';
import { useTitleLanguageStore } from '@/store/title-language-store';

export default function TrendingCarousel({ animes }: { animes: Top10Anime[] }) {
    const { language } = useTitleLanguageStore();

    if (!animes || animes.length === 0) return null;

    return (
        <section>
            <h2 className="text-title font-bold border-l-4 border-primary pl-3 mb-4">Trending</h2>
             <Carousel
                opts={{
                    align: "start",
                    dragFree: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {animes.map((anime, index) => {
                        const title = language === 'romaji' && anime.jname ? anime.jname : anime.name;
                        return (
                            <CarouselItem key={anime.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[12%] pl-4">
                                <Link href={`/anime/${anime.id}`} className="group flex items-end gap-3">
                                    <div className="text-7xl font-black text-glow-sm text-transparent bg-clip-text bg-gradient-to-b from-card to-muted-foreground -mb-2" style={{ WebkitTextStroke: '2px hsl(var(--border))' }}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <div className="relative aspect-[2/3] w-full max-w-[150px] rounded-md overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                                         <ProgressiveImage src={anime.poster} alt={title} fill className="object-cover" />
                                    </div>
                                </Link>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-card/80 hover:bg-card hidden sm:flex" />
                <CarouselNext className="right-2 bg-card/80 hover:bg-card hidden sm:flex" />
            </Carousel>
        </section>
    )
}
