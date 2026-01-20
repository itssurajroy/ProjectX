'use client';
import { SpotlightAnime } from '@/lib/types/anime';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import ProgressiveImage from '../ProgressiveImage';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Play } from 'lucide-react';
import { useTitleLanguageStore } from '@/store/title-language-store';

export default function SpotlightCarousel({ animes }: { animes: SpotlightAnime[] }) {
    const { language } = useTitleLanguageStore();

    if (!animes || animes.length === 0) {
        return <div className="aspect-[16/6] bg-card rounded-lg animate-pulse" />;
    }

    return (
        <Carousel
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            opts={{ loop: true }}
            className="w-full"
        >
            <CarouselContent>
                {animes.map(anime => {
                    const title = language === 'romaji' && anime.jname ? anime.jname : anime.name;
                    return (
                        <CarouselItem key={anime.id}>
                            <div className="w-full aspect-[9/4] md:aspect-[16/6] relative rounded-lg overflow-hidden">
                                <ProgressiveImage
                                    src={anime.poster}
                                    alt={anime.name}
                                    fill
                                    priority
                                    className="object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
                                <div className="absolute inset-0 flex items-center">
                                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                        <div className="max-w-md md:max-w-xl lg:max-w-2xl space-y-4 text-left">
                                            <Badge variant="secondary" className="text-primary font-bold animate-pulse"># {anime.rank} Spotlight</Badge>
                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-glow font-display line-clamp-3">
                                                {title}
                                            </h2>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                                {anime.otherInfo.map(info => <span key={info}>{info}</span>)}
                                            </div>
                                            <p className="text-sm line-clamp-3 text-muted-foreground">
                                                {anime.description}
                                            </p>
                                            <div className="flex gap-3">
                                                <Button asChild size="lg">
                                                    <Link href={`/anime/${anime.id}`}><Play className="w-4 h-4 mr-2"/> Watch Now</Link>
                                                </Button>
                                                <Button asChild size="lg" variant="secondary">
                                                     <Link href={`/anime/${anime.id}`}>Details</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            <CarouselPrevious className="left-4 hidden md:flex" />
            <CarouselNext className="right-4 hidden md:flex" />
        </Carousel>
    );
}
