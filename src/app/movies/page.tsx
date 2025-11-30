
'use client';

import { AnimeCard } from "@/components/AnimeCard";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeService } from "@/lib/AnimeService";
import { SearchResult } from "@/types/anime";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { cn } from "@/lib/utils";

const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
        {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        ))}
    </div>
);

function MoviesPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = Number(searchParams.get('page') || '1');

    const { data: moviesResult, isLoading, error, refetch } = useQuery<{ data: SearchResult }>({
        queryKey: ['movies', page],
        queryFn: () => AnimeService.advancedSearch({ query: '', type: 'Movie', page }),
    });

    const handlePageChange = (newPage: number) => {
        router.push(`${pathname}?page=${newPage}`);
    };

    const Pagination = ({ currentPage, totalPages, hasNextPage }: { currentPage: number, totalPages: number, hasNextPage: boolean}) => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if(endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex justify-center items-center gap-2 mt-12">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-card/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {pages.map(p => (
                     <button key={p} onClick={() => handlePageChange(p)} className={cn("px-4 py-2 text-sm rounded-md", p === currentPage ? 'bg-primary text-primary-foreground' : 'bg-card/50 hover:bg-muted')}>
                        {p}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-card/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        )
    }

    const renderContent = () => {
        if (isLoading) return <LoadingSkeleton />;
        if (error || (moviesResult && 'success' in moviesResult && !moviesResult.success)) return <ErrorDisplay title="Failed to load movies" description={(error as Error)?.message || (moviesResult as any)?.error} onRetry={refetch} />;
        
        const moviesData = moviesResult?.data;
        if (!moviesData || !moviesData.animes || moviesData.animes.length === 0) {
            return <p className="text-center text-muted-foreground mt-16">No movies found.</p>;
        }
    
        const { animes, currentPage, totalPages, hasNextPage } = moviesData;
        
        return (
          <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
              {animes.map((anime: any) => (
                  <AnimeCard key={anime.id} anime={anime} />
              ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} />
          </>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8 pt-24 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold">Movies</h1>
            {renderContent()}
        </div>
    )
}

export default function MoviesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>}>
            <MoviesPageContent />
        </Suspense>
    )
}
