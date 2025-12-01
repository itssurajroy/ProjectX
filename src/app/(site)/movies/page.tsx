
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { AnimeCard } from '@/components/AnimeCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Film, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Suspense } from 'react';
import { AnimeService } from '@/lib/AnimeService';
import { SearchResult } from '@/types/anime';

function MoviesPageContent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<SearchResult>({
    queryKey: ['movies'],
    queryFn: ({ pageParam = 1 }) => AnimeService.movies(pageParam),
    getNextPageParam: (lastPage: any) => lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });

  const movies = data?.pages.flatMap(p => p.animes).filter(Boolean) || [];

  return (
    <>
      <div className="relative h-96 bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-6 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-6 text-2xl px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600">
              <Film className="w-8 h-8 mr-3" /> ANIME MOVIES
            </Badge>
            <h1 className="text-8xl font-black bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Cinema Collection
            </h1>
            <p className="text-2xl text-gray-300 mt-6">All full-length anime films in one place.</p>
            {movies.length > 0 && (
                <div className="mt-8 text-xl text-gray-300">
                <Sparkles className="inline w-8 h-8 text-yellow-400 mr-2" />
                <strong>{movies.length.toLocaleString()}+</strong> movies loaded
                </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {isLoading && <MoviesSkeleton />}

        {isError && (
          <div className="text-center py-32 text-red-400">
            <p className="text-2xl mb-4">Failed to load movies</p>
            <p className="text-gray-500">Error: {(error as any)?.message}</p>
          </div>
        )}

        {movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
              {movies.map((movie: any, i: number) => (
                <motion.div key={`${movie.id}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <Link href={`/anime/${movie.id}`}>
                    <div className="group relative rounded-2xl overflow-hidden">
                      <AnimeCard anime={movie} />
                      {movie.duration && (
                        <Badge className="absolute top-3 right-3 bg-black/80 backdrop-blur text-xs font-bold">
                          {movie.duration}
                        </Badge>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center mt-20">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-24 py-8 text-2xl font-bold rounded-full shadow-2xl"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More Movies'}
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
      {Array.from({ length: 32 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[2/3] rounded-2xl bg-gray-900/70" />
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
