
'use client';

import { AnimeBase } from "@/types/anime";
import Link from "next/link";
import ProgressiveImage from "../ProgressiveImage";

interface RelationsSidebarProps {
    relatedAnimes: AnimeBase[];
}

export default function RelationsSidebar({ relatedAnimes }: RelationsSidebarProps) {
    if (!relatedAnimes || relatedAnimes.length === 0) {
        return null;
    }

    return (
        <div className="bg-card/50 p-4 rounded-lg border border-border/50 space-y-3 sticky top-20">
            <h3 className="text-lg font-bold font-display">Related Anime</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {relatedAnimes.map(anime => (
                    <Link href={`/anime/${anime.id}`} key={anime.id} className="flex items-center gap-3 group">
                        <div className="relative w-12 h-[72px] flex-shrink-0 rounded-md overflow-hidden">
                            <ProgressiveImage src={anime.poster} alt={anime.name || 'poster'} fill className="object-cover" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{anime.name}</p>
                            <p className="text-xs text-muted-foreground">{anime.type}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
