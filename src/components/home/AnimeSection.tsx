
'use client';

import { AnimeBase } from "@/types/anime";
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export const AnimeSection = ({ title, animes, viewMoreLink }: { title: string, animes: AnimeBase[], viewMoreLink?: string }) => {
    if (!animes || animes.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">{title}</h2>
                {viewMoreLink && (
                    <Button variant="link" asChild>
                        <Link href={viewMoreLink} className="flex items-center gap-1">
                            View More <ArrowRight className="w-4 h-4"/>
                        </Link>
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                {animes.slice(0, 12).map((anime, index) => (
                    <AnimeCard key={`${anime.id}-${index}`} anime={anime} />
                ))}
            </div>
        </section>
    );
};
