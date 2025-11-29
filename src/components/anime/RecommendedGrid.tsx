
'use client';

import { AnimeBase } from "@/types/anime";
import { AnimeCard } from "@/components/AnimeCard";

interface RecommendedGridProps {
    recommendedAnimes: AnimeBase[];
}

export default function RecommendedGrid({ recommendedAnimes }: RecommendedGridProps) {
    if (!recommendedAnimes || recommendedAnimes.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display">Recommended For You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                {recommendedAnimes.slice(0, 10).map(anime => (
                    <AnimeCard key={anime.id} anime={anime} />
                ))}
            </div>
        </div>
    )
}
