
'use client';

import { AnimeSeason } from "@/lib/types/anime";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProgressiveImage from "../ProgressiveImage";

interface SeasonsSwiperProps {
    seasons: AnimeSeason[];
    currentAnimeId: string;
}

export default function SeasonsSwiper({ seasons, currentAnimeId }: SeasonsSwiperProps) {
    if (!seasons || !Array.isArray(seasons) || seasons.length <= 1) {
        return null;
    }

    return (
        <section>
            <h2 className="text-title mb-4 border-l-4 border-primary pl-3">More Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {seasons.map(season => (
                    <Link href={`/anime/${season.id}`} key={season.id} className="group">
                         <div className={cn(
                            "relative rounded-lg overflow-hidden aspect-[16/9] transition-all border-2",
                            season.id === currentAnimeId ? "border-primary shadow-lg shadow-primary/20" : "border-transparent hover:border-primary/50"
                        )}>
                            <ProgressiveImage
                                src={season.poster}
                                alt={season.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-95" />
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                                <p className={cn(
                                    "text-center font-bold text-xs leading-tight transition-colors",
                                    season.id === currentAnimeId ? "text-primary" : "text-white group-hover:text-primary"
                                )}>
                                    {season.title}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
