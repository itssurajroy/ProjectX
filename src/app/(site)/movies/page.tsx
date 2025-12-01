
'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AnimeCard } from '@/components/AnimeCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Film, Sparkles, Filter, ChevronDown, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Suspense, useState, useMemo } from 'react';
import { AnimeService } from '@/lib/AnimeService';
import { HomeData, SearchResult } from '@/types/anime';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { years } from '@/lib/data';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Image from 'next/image';


function MoviesFilter() {
  const { data: homeDataResult } = useQuery<HomeData>({
      queryKey: ['homeData'],
      queryFn: AnimeService.home,
  });
  const genres = homeDataResult?.genres || [];
  
  return (
    <div className="bg-card/50 p-4 rounded-lg border border-border/50 backdrop-blur-sm mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
             <h3 className="text-lg font-semibold col-span-2 md:col-span-4 lg:col-span-1 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filter Movies
            </h3>
            <Select>
                <SelectTrigger className="bg-muted border-none"><SelectValue placeholder="All Genres" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map(g => <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select>
                <SelectTrigger className="bg-muted border-none"><SelectValue placeholder="All Years" /></SelectTrigger>
                <SelectContent>
                     <SelectItem value="all">All Years</SelectItem>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select defaultValue="popularity">
                <SelectTrigger className="bg-muted border-none"><SelectValue placeholder="Sort By" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
            </Select>
            <Button className="col-span-2 md:col-span-1">Apply</Button>
        </div>
    </div>
  )
}


function MoviesPageContent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<SearchResult>({
    queryKey: ['movies'],
    queryFn: ({ pageParam = 1 }) => AnimeService.movies(pageParam),
    getNextPageParam: (lastPage: any) => lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
    staleTime: 15 * 60 * 1000,
    retry: 2,
  });

  const movies = useMemo(() => data?.pages.flatMap(p => p.animes).filter(Boolean) || [], [data]);

  return (
    <>
      <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-center overflow-hidden -mt-16">
        <div className="absolute inset-0 z-0">
            <Image src="https://picsum.photos/seed/movies-hero/1920/1080" data-ai-hint="epic movie cinematic" alt="Movies Background" fill priority className="object-cover opacity-20 blur-sm scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
        >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-glow tracking-tight uppercase">
              Movie Collection
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Explore thousands of animated films, from timeless classics to the latest blockbusters.
            </p>
            {movies.length > 0 && (
                <div className="mt-8 text-lg text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <strong>{movies.length.toLocaleString()}+</strong> movies loaded and ready to watch.
                </div>
            )}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        <MoviesFilter />

        {isLoading && <MoviesSkeleton />}

        {isError && (
          <div className="text-center py-20">
             <ErrorDisplay title="Failed to Load Movies" description={(error as any)?.message} onRetry={refetch}/>
          </div>
        )}

        {movies.length > 0 && (
          <>
            <motion.div 
                className="grid-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
            >
              {movies.map((movie: any, i: number) => (
                <motion.div
                    key={`${movie.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <AnimeCard anime={movie} />
                </motion.div>
              ))}
            </motion.div>

            {hasNextPage && (
              <div className="flex justify-center mt-16">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  size="lg"
                  className="px-12 py-6 text-base font-bold shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform"
                >
                  {isFetchingNextPage ? (
                      <><RefreshCw className="w-5 h-5 mr-2 animate-spin"/> Loading...</>
                  ) : 'Load More Movies'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function MoviesSkeleton() {
  return (
    <div className="grid-cards">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] rounded-md" />
            <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export default function MoviesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>}>
            <MoviesPageContent />
        </Suspense>
    )
}
