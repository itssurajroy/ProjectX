
'use client';

import { AnimeBase } from "@/types/anime";
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import AnimeListModal from "./AnimeListModal";

export const AnimeSection = ({ title, animes, category }: { title: string, animes: AnimeBase[], category: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!animes || animes.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-title font-bold border-l-4 border-primary pl-3">{title}</h2>
                <Button variant="link" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
                    View More <ArrowRight className="w-4 h-4"/>
                </Button>
            </div>
            <div className="grid-cards">
                {animes.slice(0, 12).map((anime, index) => (
                    <AnimeCard key={`${anime.id}-${index}`} anime={anime} />
                ))}
            </div>

            <AnimeListModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                category={category}
            />
        </section>
    );
};
