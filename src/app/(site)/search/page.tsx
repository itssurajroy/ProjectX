
'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimeService } from '@/lib/AnimeService';
import { useDebounce } from 'use-debounce';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { HomeData, SearchResult, AnimeBase } from '@/types/anime';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Link from 'next/link';

interface AnimeResult {
  id: string;
  name: string;
  poster?: string;
  image?: string;
  type?: string;
  year?: string;
  episodes?: {
    sub: number;
    dub: number;
  };
}

const AdvancedFilter = ({ onFilterChange, initialValues }: { onFilterChange: (filters: any) => void, initialValues: any }) => {
    const { data: homeDataResult } = useQuery<HomeData>({
        queryKey: ['homeData'],
        queryFn: AnimeService.home,
    });
    const homeData = homeDataResult;
    const genres = homeData?.genres || [];
    
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const genreRef = useRef<HTMLDivElement>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>(initialValues.genres || []);
    const [keyword, setKeyword] = useState(initialValues.q || '');
    const [type, setType] = useState(initialValues.type || '');
    const [status, setStatus] = useState(initialValues.status || '');
    const [sort, setSort] = useState(initialValues.sort || '');

    const types = ['TV', 'Movie', 'OVA', 'ONA', 'Special'];
    const statuses = ['Airing', 'Finished Airing', 'Not yet aired'];
    const sortOptions = ['Name A-Z', 'Name Z-A', 'Score', 'Release Date'];
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (genreRef.current && !genreRef.current.contains(event.target as Node)) {
                setIsGenreDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev => 
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    }

    const handleFilter = () => {
        onFilterChange({
            q: keyword,
            genres: selectedGenres,
            type,
            status,
            sort
        });
    }

    const genreChunks: string[][] = [];
    if (genres && genres.length > 0) {
        const chunkSize = Math.ceil(genres.length / 4);
        for (let i = 0; i < genres.length; i += chunkSize) {
            genreChunks.push(genres.slice(i, i + chunkSize));
        }
    }


    return (
        <div className="bg-card/50 p-4 rounded-lg border border-border/50 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-3 items-center">
                <div className="relative xl:col-span-3">
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full bg-muted rounded-md py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                 <select onChange={(e) => setType(e.target.value)} value={type} className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    <option value="">Type</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <div ref={genreRef} className="relative xl:col-span-2">
                    <button onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)} className="w-full bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm flex justify-between items-center">
                        <span>Genre</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isGenreDropdownOpen && (
                        <div className="absolute top-full mt-2 w-[450px] bg-[#1a1a1a] p-4 rounded-lg shadow-xl z-20 border border-border">
                            <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                                {genreChunks.map((chunk, chunkIndex) => (
                                    <div key={chunkIndex} className="flex flex-col gap-2">
                                        {chunk.map(genre => (
                                            <label key={genre} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedGenres.includes(genre)}
                                                    onChange={() => toggleGenre(genre)}
                                                    className="form-checkbox h-4 w-4 rounded bg-muted/50 border-border text-primary focus:ring-primary"
                                                />
                                                {genre}
                                            </label>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <select onChange={(e) => setStatus(e.target.value)} value={status} className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    <option value="">Status</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                 <select onChange={(e) => setSort(e.target.value)} value={sort} className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <button onClick={handleFilter} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 xl:col-span-1">
                    <SlidersHorizontal className="w-5 h-5"/> Filter
                </button>
            </div>
        </div>
    )
}

const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
        {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        ))}
    </div>
);

const SearchResultCard = ({ anime }: { anime: AnimeResult }) => (
    <Link href={`/anime/${anime.id}`} className="group cursor-pointer">
      <div className="aspect-[2/3] relative overflow-hidden rounded-xl shadow-2xl">
        <Image
          src={anime.poster || anime.image || '/placeholder.jpg'}
          alt={anime.name}
          fill
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <p className="font-bold text-sm line-clamp-2">{anime.name}</p>
          <div className="text-xs opacity-80 mt-1 flex items-center gap-2">
            <span>{anime.type || 'TV'}</span>
            {anime.episodes?.sub && <span>EP {anime.episodes.sub}</span>}
          </div>
        </div>
      </div>
    </Link>
)

function SearchPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const getInitialFilters = () => ({
      q: searchParams.get('q') || '',
      genres: searchParams.get('genres')?.split(',') || [],
      type: searchParams.get('type') || '',
      status: searchParams.get('status') || '',
      sort: searchParams.get('sort') || 'popularity'
  });

  const [filters, setFilters] = useState(getInitialFilters);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery<{ data: SearchResult }, Error>({
    queryKey: ['search', filters],
    queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams();
        if (filters.q) params.set('q', filters.q);
        if (filters.genres.length > 0) params.set('genres', filters.genres.join(','));
        if (filters.type) params.set('type', filters.type);
        if (filters.status) params.set('status', filters.status);
        if (filters.sort) params.set('sort', filters.sort);
        params.set('page', String(pageParam));
        
        return AnimeService.request(`/search?${params.toString()}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
        return lastPage.data?.hasNextPage ? (lastPage.data.currentPage || 0) + 1 : undefined;
    },
  });

  const handleFilterChange = (newFilters: any) => {
      const formattedFilters = {
          q: newFilters.q || '',
          genres: newFilters.genres || [],
          type: newFilters.type || '',
          status: newFilters.status || '',
          sort: newFilters.sort || 'popularity',
      };
      setFilters(formattedFilters);
      
      const params = new URLSearchParams();
      if(formattedFilters.q) params.set('q', formattedFilters.q);
      if(formattedFilters.genres.length > 0) params.set('genres', formattedFilters.genres.join(','));
      if(formattedFilters.type) params.set('type', formattedFilters.type);
      if(formattedFilters.status) params.set('status', formattedFilters.status);
      if(formattedFilters.sort) params.set('sort', formattedFilters.sort);

      router.push(`/search?${params.toString()}`);
  }

  const animes = data?.pages.flatMap(page => page.data?.animes || []) ?? [];

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
        }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);


  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 text-glow">
          Search Anime
        </h1>

        <AdvancedFilter onFilterChange={handleFilterChange} initialValues={filters}/>
        
        {isLoading ? <LoadingSkeleton /> :
         error ? <ErrorDisplay title="Search Failed" description={error.message} onRetry={refetch} /> :
         animes.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
              {animes.map((anime, index) => (
                <div key={`${anime.id}-${index}`} ref={index === animes.length - 1 ? lastElementRef : null}>
                 <SearchResultCard anime={anime} />
                </div>
              ))}
            </div>
            {isFetchingNextPage && (
                 <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></div>
                </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">No anime found</p>
            <p className="text-gray-600 mt-4">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>}>
            <SearchPageComponent />
        </Suspense>
    )
}
