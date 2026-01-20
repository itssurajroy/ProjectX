'use client';
import { AnimeBase } from "@/lib/types/anime";
import Link from "next/link";
import ProgressiveImage from "../ProgressiveImage";
import { Clapperboard, Mic } from "lucide-react";
import { Button } from "../ui/button";
import { useTitleLanguageStore } from "@/store/title-language-store";
import { useState } from "react";
import AnimeListModal from "./AnimeListModal";

export default function AnimeColumn({ title, animes, category }: { title: string, animes: AnimeBase[] | undefined, category: string }) {
    const { language } = useTitleLanguageStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!animes || animes.length === 0) return null;
    
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <div className="space-y-3">
                {animes.slice(0, 7).map((anime, index) => {
                    const animeTitle = language === 'romaji' && anime.jname ? anime.jname : anime.name;
                    return (
                        <Link key={`${anime.id}-${index}`} href={`/anime/${anime.id}`} className="flex items-center gap-3 group">
                             <div className="relative w-12 h-16 flex-shrink-0">
                                <ProgressiveImage src={anime.poster} alt={animeTitle} fill className="object-cover rounded-md" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{animeTitle}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    {anime.episodes?.sub && <span className="flex items-center gap-1"><Clapperboard className="w-3 h-3"/> {anime.episodes.sub}</span>}
                                    {anime.episodes?.dub && <span className="flex items-center gap-1"><Mic className="w-3 h-3"/> {anime.episodes.dub}</span>}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setIsModalOpen(true)}>View More</Button>
            <AnimeListModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                category={category}
            />
        </div>
    )
}
