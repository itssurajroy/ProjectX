'use client';

import Link from "next/link";
import { Play } from "lucide-react";
import ProgressiveImage from "@/components/ProgressiveImage";
import { AnimeBase, UserHistory } from "@/lib/types/anime";
import { Progress } from "@/components/ui/progress";

const HistoryItem = ({ item, anime }: { item: UserHistory; anime: AnimeBase | undefined }) => {
    if (!anime) return null;

    // We don't have real progress, so this is just a visual placeholder for now
    const progressPercent = item.progress > 0 && item.duration > 0 ? (item.progress / item.duration) * 100 : 5;
    const watchUrl = `/watch/${item.animeId}?ep=${item.episodeNumber}`;

    return (
        <Link href={watchUrl} className="group block">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-card shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <ProgressiveImage
                    src={anime.poster}
                    alt={anime.name || "Anime Poster"}
                    fill
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 shadow-xl">
                        <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1">
                    <p className="font-bold text-sm text-white truncate group-hover:text-primary transition-colors">
                        Ep {item.episodeNumber}
                    </p>
                    <Progress value={progressPercent} className="h-1 bg-white/30" />
                </div>
            </div>
        </Link>
    );
};

export default HistoryItem;
