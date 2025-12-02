
'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { AnimeCard } from './AnimeCard';
import { Loader2 } from 'lucide-react';
import ErrorDisplay from './common/ErrorDisplay';
import { AnimeBase } from '@/types/anime';
import { Progress } from './ui/progress';
import Link from 'next/link';

interface HistoryEntry extends AnimeBase {
    watchedAt: any;
    episodeNumber: number;
    progress: number;
    duration: number;
    episodeId: string;
}

export default function HistoryClient({ userId }: { userId: string }) {
    const firestore = useFirestore();

    const historyRef = useMemoFirebase(() => collection(firestore, 'users', userId, 'history'), [firestore, userId]);
    const historyQuery = useMemoFirebase(() => query(historyRef, orderBy('watchedAt', 'desc')), [historyRef]);

    const { data: history, isLoading, error } = useCollection<HistoryEntry>(historyQuery);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-primary w-16 h-16" />
            </div>
        );
    }

    if (error) {
        return <ErrorDisplay title="Could not load your history" description={error.message} />
    }

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [h, m, s]
            .map(v => v.toString().padStart(2, '0'))
            .filter((v, i) => v !== '00' || i > 0)
            .join(':');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My History</h1>
                {history && <p className="text-muted-foreground">{history.length} items</p>}
            </div>

            {history && history.length > 0 ? (
                <div className="grid-cards">
                    {history.map(item => {
                        const progressPercent = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
                        const episodeNumberFromId = item.episodeId.split('?ep=')[1];

                        return (
                            <div key={item.id}>
                                <Link href={`/watch/${item.animeId}?ep=${episodeNumberFromId}`}>
                                    <AnimeCard anime={item} />
                                </Link>
                                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                    <p className="font-bold">Watched Ep. {item.episodeNumber}</p>
                                    <div className="space-y-1">
                                        <Progress value={progressPercent} className="h-2" />
                                        <div className="flex justify-between text-xs">
                                            <span>{formatTime(item.progress)}</span>
                                            <span>{formatTime(item.duration)}</span>
                                        </div>
                                    </div>
                                    {item.watchedAt && <p className="text-xs">{new Date(item.watchedAt?.seconds * 1000).toLocaleDateString()}</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold">No history yet</h3>
                    <p className="text-muted-foreground">Start watching shows to build your history.</p>
                </div>
            )}
        </div>
    );
}
