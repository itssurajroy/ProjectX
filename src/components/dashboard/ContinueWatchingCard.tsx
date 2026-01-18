'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { AnimeBase, UserHistory } from '@/lib/types/anime';
import ProgressiveImage from '@/components/ProgressiveImage';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';

const ContinueWatchingCard = ({ historyItem, animeDetails }: { historyItem: UserHistory, animeDetails: AnimeBase }) => {
    const watchUrl = `/watch/${historyItem.animeId}?ep=${historyItem.episodeNumber}`;

    return (
        <section>
            <h2 className="text-2xl font-bold font-display mb-4">Continue Watching</h2>
            <div className="relative bg-card/50 rounded-xl p-4 md:p-6 border border-border/50 overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-full z-0">
                    <ProgressiveImage
                        src={animeDetails.poster}
                        alt={animeDetails.name}
                        fill
                        className="object-cover object-top opacity-10 blur-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-card/10 to-card/80" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6">
                    <Link href={watchUrl} className="relative w-full md:w-48 aspect-video rounded-lg overflow-hidden shrink-0">
                        <ProgressiveImage 
                            src={animeDetails.poster} 
                            alt={animeDetails.name}
                            fill 
                            className="object-cover transition-transform group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Play className="w-10 h-10 text-white" />
                        </div>
                    </Link>
                    <div className="flex flex-col">
                        <p className="text-sm text-primary font-semibold">Latest Watched</p>
                        <h3 className="text-xl font-bold text-foreground">{animeDetails.name}</h3>
                        <p className="text-muted-foreground">
                            Episode {historyItem.episodeNumber}
                             {historyItem.watchedAt && (
                                <span className="ml-2">&bull; Watched {formatDistanceToNow(historyItem.watchedAt.toDate(), { addSuffix: true })}</span>
                            )}
                        </p>
                        <div className="mt-auto pt-4">
                            <Button asChild>
                                <Link href={watchUrl}>
                                    <Play className="w-4 h-4 mr-2" /> Resume
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContinueWatchingCard;
