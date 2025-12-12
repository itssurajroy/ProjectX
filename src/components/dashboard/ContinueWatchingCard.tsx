
'use client';

import Link from "next/link";
import { Play } from "lucide-react";
import { AnimeBase, UserHistory } from "@/lib/types/anime";
import ProgressiveImage from "@/components/ProgressiveImage";
import { AnimeCard } from "@/components/AnimeCard";

const ContinueWatchingCard = ({ historyItem, animeDetails }: { historyItem: UserHistory, animeDetails: AnimeBase }) => {
    const progress = (historyItem.progress / historyItem.duration) * 100;
    const watchUrl = `/watch/${historyItem.animeId}?ep=${historyItem.episodeNumber}`;
    
    return (
        <Link href={watchUrl}>
            <div className="w-full">
                <div className="relative aspect-[2/3] group">
                    <AnimeCard anime={animeDetails} />
                    <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-muted/70 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ContinueWatchingCard;
