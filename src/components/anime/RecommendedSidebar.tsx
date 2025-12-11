

'use client';

import { AnimeBase } from "@/types/anime";
import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { CldImage } from "next-cloudinary";

export default function RankedAnimeSidebar({ title, animes, icon }: { title: string, animes: AnimeBase[], icon?: React.ReactNode }) {
    if (!animes || animes.length === 0) return null;

    return (
        <div className='bg-card/50 p-4 rounded-lg border border-border/50'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-bold flex items-center gap-2">{icon} {title}</h2>
            </div>
            <div className="space-y-2">
            {animes.slice(0, 10).map((anime, index) => (
                <Link
                    key={anime.id}
                    href={`/anime/${anime.id}`}
                    className="relative block p-3 rounded-lg overflow-hidden group hover:bg-muted/50 transition-colors"
                >
                    <CldImage
                        src={anime.poster}
                        alt={anime.name}
                        fill
                        crop="fill"
                        sizes="200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent"></div>
                    
                    <div className="relative flex items-center gap-3">
                         <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-border flex items-center justify-center font-bold text-lg">
                            {index + 1}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{anime.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                {anime.episodes?.sub && <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary/90"><Clapperboard className="w-3 h-3"/> {anime.episodes.sub}</span>}
                                {anime.episodes?.dub && <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-green-500/20 text-green-300">DUB {anime.episodes.dub}</span>}
                                <span className='hidden sm:inline'>{anime.type}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        </div>
    );
};
