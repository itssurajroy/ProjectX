
'use client';

import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { AnimeBase } from "@/lib/types/anime";
import Link from "next/link";

const WatchlistGrid = ({ animes }: { animes: AnimeBase[] }) => {
    if (animes.length === 0) {
        return (
            <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                <p className="text-muted-foreground">No anime in this category.</p>
                 <Button asChild variant="link"><Link href="/home">Explore Anime</Link></Button>
            </div>
        )
    }
    return (
        <div className="grid-cards">
            {animes.map(anime => (
                <AnimeCard key={anime.id} anime={anime} />
            ))}
        </div>
    )
}

export default WatchlistGrid;
