
'use client';

import { AnimeSeason } from "@/types/anime";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SeasonsSwiperProps {
    seasons: AnimeSeason[];
    currentAnimeId: string;
}

export default function SeasonsSwiper({ seasons, currentAnimeId }: SeasonsSwiperProps) {
    if (!seasons || seasons.length <= 1) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display">Seasons</h2>
            <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                    {seasons.map(season => (
                        <CarouselItem key={season.id} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8">
                             <Link href={`/anime/${season.id}`}>
                                <div className={cn(
                                    "relative aspect-[2/3] rounded-md overflow-hidden group border-2 transition-all", 
                                    season.id === currentAnimeId ? "border-primary shadow-lg shadow-primary/30" : "border-transparent hover:border-primary/50"
                                )}>
                                    <Image src={season.poster} alt={season.title} fill className="object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                                        <p className="text-white font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors">{season.title}</p>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>
        </div>
    )
}
