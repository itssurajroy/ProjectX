
'use client';

import { AnimeSeason } from "@/types/anime";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CldImage } from "next-cloudinary";

interface SeasonsSwiperProps {
    seasons: AnimeSeason[];
    currentAnimeId: string;
}

export default function SeasonsSwiper({ seasons, currentAnimeId }: SeasonsSwiperProps) {
    if (!seasons || seasons.length <= 1) {
        return null;
    }

    return (
        <section>
            <h2 className="text-title mb-4 border-l-4 border-primary pl-3">Seasons</h2>
            <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                    {seasons.map(season => (
                        <CarouselItem key={season.id} className="basis-1/3 sm:basis-1/4 md:basis-1/5">
                             <Link href={`/anime/${season.id}`}>
                                <div className={cn(
                                    "relative aspect-[2/3] rounded-lg overflow-hidden group border-2 transition-all", 
                                    season.id === currentAnimeId ? "border-primary shadow-lg shadow-primary/30" : "border-transparent hover:border-primary/50"
                                )}>
                                    <CldImage 
                                        src={season.poster || "https://res.cloudinary.com/dyq1rxdmm/image/upload/v1/placeholder.jpg"} 
                                        alt={season.title || "Season Poster"} 
                                        fill 
                                        crop="fill" 
                                        className="object-cover transition-transform group-hover:scale-105" 
                                        loading="lazy"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                                        <p className="text-white font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors">{season.title}</p>
                                    </div>
                                    {season.isCurrent && (
                                        <div className="absolute top-1 right-1 px-1.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md">
                                            Current
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-card/80 hover:bg-card" />
                <CarouselNext className="right-2 bg-card/80 hover:bg-card" />
            </Carousel>
        </section>
    )
}
