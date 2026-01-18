'use client';

import Link from "next/link";
import { Play, Clock } from "lucide-react";
import ProgressiveImage from "@/components/ProgressiveImage";
import { AnimeBase, UserHistory } from "@/lib/types/anime";
import { formatDistanceToNow } from "date-fns";

const HistoryItem = ({ item, anime }: { item: UserHistory; anime: AnimeBase | undefined }) => {
    if (!anime) return null;

    const watchUrl = `/watch/${item.animeId}?ep=${item.episodeNumber}`;

    return (
        <div className="flex items-center gap-4 p-3 bg-card/50 rounded-lg border border-border/50">
            <Link href={watchUrl} className="relative w-16 h-24 flex-shrink-0 group">
                <ProgressiveImage
                    src={anime.poster}
                    alt={anime.name || "Anime Poster"}
                    fill
                    className="object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white" />
                </div>
            </Link>
            <div className="flex-1 overflow-hidden">
                <Link href={`/anime/${anime.id}`} className="font-semibold hover:text-primary line-clamp-1 block">{anime.name}</Link>
                <p className="text-sm text-muted-foreground">Episode {item.episodeNumber}</p>
                {item.watchedAt && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                        <Clock className="w-3 h-3" />
                        <span>
                            Watched {formatDistanceToNow(item.watchedAt.toDate(), { addSuffix: true })}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryItem;
