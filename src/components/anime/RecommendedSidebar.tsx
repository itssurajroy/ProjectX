
'use client';

import { AnimeBase } from "@/lib/types/anime";
import Link from "next/link";
import { Clapperboard, Plus } from "lucide-react";
import ProgressiveImage from "../ProgressiveImage";

export default function RankedAnimeSidebar({ title, animes, icon }: { title: string, animes: AnimeBase[], icon?: React.ReactNode }) {
    if (!animes || animes.length === 0) return null;

    return (
        <div className='bg-card p-3 rounded-lg border border-border'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                <h2 className="text-md font-bold flex items-center gap-2">{icon} {title}</h2>
            </div>
            <div className="space-y-1">
            {animes.slice(0, 10).map((anime, index) => (
                <Link
                    key={anime.id}
                    href={`/anime/${anime.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg group hover:bg-accent transition-colors"
                >
                    <div className="relative w-12 h-[72px] flex-shrink-0">
                        <ProgressiveImage
                            src={anime.poster}
                            alt={anime.name || "Anime Poster"}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{anime.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className='hidden sm:inline'>{anime.type}</span>
                            {anime.episodes?.sub && <span className="flex items-center gap-1"><Clapperboard className="w-3 h-3"/> {anime.episodes.sub}</span>}
                            {anime.episodes?.dub && <span className="flex items-center gap-1">DUB {anime.episodes.dub}</span>}
                        </div>
                    </div>
                    <div className="p-2 bg-muted/50 group-hover:bg-primary/20 rounded-md">
                      <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary"/>
                    </div>
                </Link>
            ))}
            </div>
        </div>
    );
};
