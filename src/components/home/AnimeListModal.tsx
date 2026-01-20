'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimeService } from '@/lib/services/AnimeService';
import { AnimeBase, SearchResult } from "@/lib/types/anime";
import { AnimeCard } from "../AnimeCard";
import { Skeleton } from "../ui/skeleton";
import ErrorDisplay from "../common/ErrorDisplay";
import { useCallback, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface AnimeListModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    category: string;
}

const LoadingSkeleton = () => (
    <div className="grid-cards">
        {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        ))}
    </div>
);


export default function AnimeListModal({ isOpen, onClose, title, category }: AnimeListModalProps) {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch
    } = useInfiniteQuery<{data: SearchResult}>({
        queryKey: ['category', category],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams();
            if (['top-airing', 'most-popular', 'most-favorite', 'completed', 'top-upcoming', 'latest-episode'].includes(category)) {
                params.set('sort', 'popularity'); // default sort
                if(category === 'top-airing') params.set('status', 'Airing');
                if(category === 'latest-episode') params.set('sort', 'latest');
                if(category === 'top-upcoming') params.set('status', 'Not yet aired');
            }
            params.set('page', pageParam.toString());
            return AnimeService.search(params);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.data.hasNextPage ? lastPage.data.currentPage + 1 : undefined,
        enabled: isOpen,
    });
    
    const observer = useRef<IntersectionObserver>();
    const lastAnimeElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading || isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);


    const allAnimes = data?.pages.flatMap(page => page.data?.animes) ?? [];

    const renderContent = () => {
        if (isLoading) return <LoadingSkeleton />;
        if (error) return <ErrorDisplay title={`Failed to load ${title}`} description={error.message} onRetry={refetch} isCompact/>;

        if (allAnimes.length === 0) {
            return <p className="text-center text-muted-foreground py-16">No anime found in this category.</p>;
        }

        return (
            <>
                <div className="grid-cards">
                    {allAnimes.map((anime: AnimeBase, index) => {
                         if (allAnimes.length === index + 1) {
                            return <div ref={lastAnimeElementRef} key={anime.id}><AnimeCard anime={anime} /></div>
                         }
                         return <AnimeCard key={`${anime.id}-${index}`} anime={anime} />;
                    })}
                </div>
                {isFetchingNextPage && (
                     <div className="flex justify-center mt-8">
                        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
            </>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                    <DialogDescription>
                        Browse the full list of {title.toLowerCase()} anime.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 -mx-6 px-6">
                    {renderContent()}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
