
'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { AnimeCard } from './AnimeCard';
import { Loader2 } from 'lucide-react';
import ErrorDisplay from './common/ErrorDisplay';
import { AnimeBase } from '@/types/anime';

interface WatchlistEntry extends AnimeBase {
    addedAt: any;
}

export default function WatchlistClient({ userId }: { userId: string }) {
    const firestore = useFirestore();

    const watchlistRef = useMemoFirebase(() => collection(firestore, 'users', userId, 'watchlist'), [firestore, userId]);
    const watchlistQuery = useMemoFirebase(() => query(watchlistRef, orderBy('addedAt', 'desc')), [watchlistRef]);
    
    const { data: watchlist, isLoading, error } = useCollection<WatchlistEntry>(watchlistQuery);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-primary w-16 h-16" />
            </div>
        );
    }
    
    if (error) {
        return <ErrorDisplay title="Could not load your watchlist" description={error.message} />
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Watchlist</h1>
                {watchlist && <p className="text-muted-foreground">{watchlist.length} items</p>}
            </div>

            {watchlist && watchlist.length > 0 ? (
                <div className="grid-cards">
                    {watchlist.map(item => (
                       <AnimeCard key={item.id} anime={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold">Your watchlist is empty</h3>
                    <p className="text-muted-foreground">Click the bookmark icon on an anime to add it here.</p>
                </div>
            )}
        </div>
    );
}
