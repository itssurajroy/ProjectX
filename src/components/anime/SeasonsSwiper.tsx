
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
                    <Link href={`/anime/${season.id}`} key={season.id}>
                        <div className={cn(
                            "p-3 text-center font-semibold text-sm rounded-md transition-colors",
                            season.id === currentAnimeId ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
                        )}>
                            {season.title}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
