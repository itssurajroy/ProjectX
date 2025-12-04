
'use client';
import { useMemo, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { AnimeBase } from '@/types/anime';
import { Bookmark, Filter, ListFilter, Loader2 } from 'lucide-react';
import { AnimeCard } from '@/components/AnimeCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WatchlistItem extends AnimeBase {
    status: 'Watching' | 'Completed' | 'On-Hold' | 'Dropped' | 'Plan to Watch';
    addedAt: any;
}


const WatchlistGrid = ({ animes }: { animes: WatchlistItem[] }) => {
    if (animes.length === 0) {
        return (
            <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                <p className="text-muted-foreground">No anime in this category.</p>
            </div>
        )
    }
    return (
        <div className="grid-cards">
            {animes.map(anime => (
                <AnimeCard key={anime.id} anime={anime} />
            ))}
        </div>
    )
}

export default function WatchlistPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('addedAt_desc');

    const watchlistQuery = useMemoFirebase(() => {
        if (!user) return null;
        let q = query(collection(firestore, 'users', user.uid, 'watchlist'));
        
        const [field, direction] = sortOrder.split('_');
        
        if (field && direction) {
            q = query(q, orderBy(field, direction as 'asc' | 'desc'));
        }

        return q;
    }, [user, firestore, sortOrder]);

    const { data: watchlistItems, isLoading } = useCollection<WatchlistItem>(watchlistQuery);

    const filteredAndSortedItems = useMemo(() => {
        if (!watchlistItems) return [];
        let items = [...watchlistItems];

        if (statusFilter !== 'All') {
            items = items.filter(item => item.status === statusFilter);
        }
        
        return items;
    }, [watchlistItems, statusFilter]);

    const statuses = ['All', 'Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'];
    const sortOptions = [
        { value: 'addedAt_desc', label: 'Recently Added' },
        { value: 'name_asc', label: 'Title (A-Z)' },
        { value: 'name_desc', label: 'Title (Z-A)' },
    ];


    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Bookmark className="w-8 h-8 text-primary" />
                    Watchlist
                </h1>
                <div className="flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <ListFilter className="w-4 h-4"/>
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                                {sortOptions.map(opt => (
                                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full sm:w-auto">
                    {statuses.map(s => (
                        <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : filteredAndSortedItems ? (
                <WatchlistGrid animes={filteredAndSortedItems} />
            ) : (
                <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Your watchlist is empty.</p>
                </div>
            )}
        </div>
    )
}
