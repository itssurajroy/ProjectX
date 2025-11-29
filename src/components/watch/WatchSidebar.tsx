
'use client';
import { AnimeInfo, AnimeBase } from "@/types/anime";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface WatchSidebarProps {
    animeInfo: AnimeInfo;
    animeId: string;
    episodeId: string | null;
    mostPopular: AnimeBase[];
}

export default function WatchSidebar({ animeInfo, animeId, episodeId, mostPopular }: WatchSidebarProps) {
    return (
        <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border/50 p-4">
                <div className="flex gap-4">
                    <div className="w-24 flex-shrink-0">
                        <Image src={animeInfo.poster} alt={animeInfo.name} width={96} height={144} className="rounded-md" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{animeInfo.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: animeInfo.description }} />
                    </div>
                </div>
                 <Button asChild className="w-full mt-4" variant="outline">
                    <Link href={`/anime/${animeId}`}>View Details</Link>
                </Button>
            </div>

            {mostPopular && mostPopular.length > 0 && (
                <div className="bg-card rounded-lg border border-border/50 p-4">
                    <h3 className="font-bold text-lg mb-4">Most Popular</h3>
                    <div className="space-y-3">
                        {mostPopular.slice(0, 5).map(anime => (
                            <Link key={anime.id} href={`/anime/${anime.id}`} className="flex gap-3 group">
                                <div className="w-16 flex-shrink-0">
                                    <Image src={anime.poster} alt={anime.name} width={64} height={96} className="rounded-md" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold group-hover:text-primary transition-colors line-clamp-2">{anime.name}</p>
                                    <p className="text-sm text-muted-foreground">{anime.type} - {anime.episodes?.sub} EPs</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
