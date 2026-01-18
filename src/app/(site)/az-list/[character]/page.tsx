

'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams, useRouter, usePathname, useParams } from 'next/navigation';
import { Suspense, useState, useRef, useEffect, useCallback, use } from 'react';
import { AnimeCard } from '@/components/AnimeCard';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SearchResult } from '@/lib/types/anime';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimeService } from '@/lib/services/AnimeService';
import { AnimeTooltip } from '@/components/AnimeTooltip';


const AdvancedFilter = ({ onFilterChange, initialValues }: { onFilterChange: (filters: any) => void, initialValues: any }) => {
    const { data: homeData } = useQuery({
        queryKey: ['homeData'],
        queryFn: AnimeService.home,
    });
    const genres = homeData?.genres || [];
    
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const genreRef = useRef<HTMLDivElement>(null);

    const [keyword, setKeyword] = useState(initialValues.q || '');
    const [selectedGenres, setSelectedGenres] = useState<string[]>(initialValues.genres || []);
    const [type, setType] = useState(initialValues.type || '');
    const [status, setStatus] = useState(initialValues.status || '');
    const [sort, setSort] = useState(initialValues.sort || 'Name A-Z');
    
    const types = ['TV', 'Movie', 'OVA', 'ONA', 'Special'];
    const statuses = ['Airing', 'Finished Airing', 'Not yet aired'];
    const sortOptions = ['Name A-Z', 'Name Z-A', 'Score', 'Release Date', 'Most Watched'];
    
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
                        onChange={e => setKeyword(e.target.value)}
                        className="w-full bg-muted rounded-md py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                 <select value={type} onChange={e => setType(e.target.value)} className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    <option value="">Type</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <div ref={genreRef} className="relative xl:col-span-2">
                    <button onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)} className="w-full bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm flex justify-between items-center">
                        <span>Genre ({selectedGenres.length})</span>
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

                <select value={status} onChange={e => setStatus(e.target.value)} className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    <option value="">Status</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                 <select value={sort} onChange={e => setSort(e.target.value)} className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <button onClick={handleFilter} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 xl:col-span-1">
                    <SlidersHorizontal className="w-5 h-5"/> Filter
                </button>
            </div>
        </div>
    )
}

const AZNav = ({ activeChar, onCharChange }: { activeChar: string, onCharChange: (char: string) => void }) => {
    const alphabet = ['All', '#', '0-9', ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))];

    const getCharPath = (char: string) => {
        if (char === 'All') return 'all';
        if (char === '#') return 'other';
        return char.toLowerCase();
    }
    
    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10">
            {alphabet.map(char => {
                const charPath = getCharPath(char);
                return (
                    <button 
                        key={char} 
                        onClick={() => onCharChange(charPath)}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-md transition-colors",
                            activeChar === charPath 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-card/50 hover:bg-muted'
                        )}
                    >
                        {char}
                    </button>
                )
            })}
        </div>
    )
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

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
    if (!totalPages || totalPages <= 1) return null;
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


function AZListPageComponent({ character }: { character: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialFilters = useCallback(() => ({
    character: character,
    page: Number(searchParams.get('page') || '1'),
    q: searchParams.get('q') || '',
    genres: searchParams.get('genres')?.split(',').filter(Boolean) || [],
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || 'Name A-Z',
  }), [character, searchParams]);

  const [filters, setFilters] = useState(getInitialFilters);

  useEffect(() => {
    setFilters(getInitialFilters());
  }, [getInitialFilters]);
  

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<{data: SearchResult}, Error>({
    queryKey: ['az-list', filters],
    queryFn: () => {
        const params = new URLSearchParams();
        params.set('char', filters.character);
        params.set('page', filters.page.toString());
        if(filters.q) params.set('q', filters.q);
        if(filters.genres.length > 0) params.set('genres', filters.genres.join(','));
        if(filters.type) params.set('type', filters.type);
        if(filters.status) params.set('status', filters.status);
        if(filters.sort) params.set('sort', filters.sort);
        return AnimeService.search(params);
    },
  });

  const updateUrl = (newFilters: Partial<typeof filters>) => {
      const mergedFilters = { ...filters, ...newFilters };
      
      const params = new URLSearchParams();
      if(mergedFilters.q) params.set('q', mergedFilters.q);
      if(mergedFilters.genres.length > 0) params.set('genres', mergedFilters.genres.join(','));
      if(mergedFilters.type) params.set('type', mergedFilters.type);
      if(mergedFilters.status) params.set('status', mergedFilters.status);
      if(mergedFilters.sort) params.set('sort', mergedFilters.sort);
      if(mergedFilters.page > 1) params.set('page', mergedFilters.page.toString());

      router.push(`/az-list/${mergedFilters.character}?${params.toString()}`);
  }

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };
  
  const handleCharChange = (newChar: string) => {
      router.push(`/az-list/${newChar}`);
  }
  
  const handleFilterChange = (newFilters: any) => {
      updateUrl({ ...newFilters, page: 1 });
  }

  const animes = data?.data.animes ?? [];
  const totalPages = data?.data.totalPages ?? 0;
  const totalAnimes = data?.data.totalAnimes ?? 0;

  const displayCharacter = filters.character === 'all' ? 'All' : filters.character === 'other' ? '#' : filters.character.toUpperCase();

  const renderContent = () => {
    if (isLoading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay title="Failed to load anime list" description={error.message} onRetry={() => refetch()} />;
    
    if (!animes || animes.length === 0) {
        return <p className="text-center text-muted-foreground mt-16">No anime found for this filter.</p>;
    }
  
    return (
      <>
          <div className="grid-cards">
          {animes.map((anime: any) => (
            <AnimeTooltip animeId={anime.id} key={anime.id}>
                <div>
                    <AnimeCard anime={anime} />
                </div>
            </AnimeTooltip>
          ))}
          </div>
          <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    );
  }

  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-title font-bold">AZ-LIST</h1>
        <p className="text-sm text-muted-foreground">{totalAnimes.toLocaleString() || '...'} anime</p>
      </div>
      <AdvancedFilter onFilterChange={handleFilterChange} initialValues={filters} />
      <AZNav activeChar={displayCharacter} onCharChange={handleCharChange} />
      {renderContent()}
    </div>
  );
}

export default function AZListPage() {
    const params = useParams();
    const character = params.character as string;

    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>}>
            <AZListPageComponent character={character} />
        </Suspense>
    )
}
