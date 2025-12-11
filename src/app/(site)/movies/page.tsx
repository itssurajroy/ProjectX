
'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimeCard } from '@/components/AnimeCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Film, Sparkles, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense, useState, useCallback } from 'react';
import { AnimeService } from '@/lib/AnimeService';
import { HomeData, SearchResult } from '@/types/anime';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { years } from '@/lib/data';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CldImage } from 'next-cloudinary';


function MoviesFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [genre, setGenre] = useState(searchParams.get('genre') || 'all');
  const [year, setYear] = useState(searchParams.get('year') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popularity');

  const { data: homeDataResult } = useQuery<HomeData>({
      queryKey: ['homeData'],
      queryFn: AnimeService.home,
  });
  const genres = homeDataResult?.genres || [];

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (genre !== 'all') params.set('genres', genre);
    if (year !== 'all') params.set('year', year);
    params.set('sort', sort);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }
  
  return (
    <div className="bg-card/50 p-4 rounded-lg border border-border/50 backdrop-blur-sm mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
             <h3 className="text-lg font-semibold col-span-2 md:col-span-4 lg:col-span-1 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filter Movies
            </h3>
            <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-muted border-none"><SelectValue placeholder="All Genres" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map(g => <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="bg-muted border-none"><SelectValue placeholder="All Years" /></SelectTrigger>
                <SelectContent>
                     <SelectItem value="all">All Years</SelectItem>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="bg-muted border-none"><SelectValue placeholder="Sort By" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleApplyFilters} className="col-span-2 md:col-span-1">Apply</Button>
        </div>
    </div>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage: number, endPage: number;
    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + 2 >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-card/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
            </button>

            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className="px-4 py-2 text-sm rounded-md bg-card/50 hover:bg-muted">1</button>
                    {startPage > 2 && <span className="px-2">...</span>}
                </>
            )}

            {pageNumbers.map(number => (
                 <button key={number} onClick={() => onPageChange(number)} className={cn("px-4 py-2 text-sm rounded-md", currentPage === number ? 'bg-primary text-primary-foreground' : 'bg-card/50 hover:bg-muted')}>
                    {number}
                </button>
            ))}

             {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-2">...</span>}
                    <button onClick={() => onPageChange(totalPages)} className="px-4 py-2 text-sm rounded-md bg-card/50 hover:bg-muted">{totalPages}</button>
                </>
            )}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-card/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    )
}

function MoviesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const page = Number(searchParams.get('page') || '1');
  const genres = searchParams.get('genres') || undefined;
  const year = searchParams.get('year') || undefined;
  const sort = searchParams.get('sort') || 'popularity';

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<SearchResult>({
    queryKey: ['movies', { page, genres, year, sort }],
    queryFn: () => {
        const params = new URLSearchParams({ 
            type: 'Movie',
            page: String(page),
            sort: sort
        });
        if (genres) params.set('genres', genres);
        if (year) params.set('year', year);
        return AnimeService.search(params);
    },
    staleTime: 15 * 60 * 1000,
    retry: 2,
  });

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);
  
  const movies = data?.animes || [];
  const totalAnimes = data?.totalAnimes || 0;

  return (
    <>
      <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-center overflow-hidden -mt-16">
        <div className="absolute inset-0 z-0">
            <CldImage 
              src="https://picsum.photos/seed/movies-hero/1920/1080" 
              data-ai-hint="epic movie cinematic" 
              alt="Movies Background" 
              fill 
              crop="fill" 
              priority 
              className="object-cover opacity-20 blur-sm scale-110"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
        >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-glow tracking-tight uppercase">
              Cinematic Universe
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Explore thousands of animated films, from timeless classics to the latest blockbusters.
            </p>
            {totalAnimes > 0 && (
                <div className="mt-8 text-lg text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <strong>{totalAnimes.toLocaleString()}+</strong> movies loaded and ready to watch.
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

            {data?.totalPages && data.totalPages > 1 && (
              <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
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
