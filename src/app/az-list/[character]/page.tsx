
'use client';

import { AnimeService } from '@/lib/AnimeService';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense, useState, useRef, useEffect } from 'react';
import { AnimeCard } from '@/components/AnimeCard';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { HomeData, SearchResult } from '@/types/anime';


const AdvancedFilter = () => {
    const { data: homeDataResult } = useQuery<{data: HomeData} | { success: false; error: string }>({
        queryKey: ['homeData'],
        queryFn: AnimeService.getHomeData,
    });
    const genres = homeDataResult && !('success' in homeDataResult) ? homeDataResult.data.genres : [];
    
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const genreRef = useRef<HTMLDivElement>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    
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
                        className="w-full bg-muted rounded-md py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                 <select className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    <option>Type</option>
                    {types.map(t => <option key={t}>{t}</option>)}
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

                <select className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    <option>Status</option>
                    {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
                 <select className="bg-muted rounded-md px-3 py-2.5 border-none focus:ring-2 focus:ring-primary focus:outline-none text-sm xl:col-span-2">
                    {sortOptions.map(s => <option key={s}>{s}</option>)}
                </select>

                <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 xl:col-span-1">
                    <SlidersHorizontal className="w-5 h-5"/> Filter
                </button>
            </div>
        </div>
    )
}

const AZNav = ({ activeChar }: { activeChar: string }) => {
    const alphabet = ['All', '#', '0-9', ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))];

    const getCharPath = (char: string) => {
        if (char === 'All') return 'all';
        if (char === '#') return 'other';
        return char.toLowerCase();
    }
    
    const activePath = getCharPath(activeChar);

    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10">
            {alphabet.map(char => {
                const charPath = getCharPath(char);
                return (
                    <Link 
                        key={char} 
                        href={`/az-list/${charPath}`} 
                        className={cn(
                            "w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-md transition-colors",
                            activePath === charPath 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-card/50 hover:bg-muted'
                        )}
                    >
                        {char}
                    </Link>
                )
            })}
        </div>
    )
}

function AZListPageComponent({ params }: { params: { character: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get('page') || '1');
  const sortOption = decodeURIComponent(params.character);
  const displayCharacter = sortOption === 'all' ? 'All' : sortOption === 'other' ? '#' : sortOption.toUpperCase();

  const { data: azResult, isLoading, error } = useQuery<{data: SearchResult}>({
    queryKey: ['az-list', sortOption, page],
    queryFn: () => AnimeService.getAZList(sortOption, page),
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

  if (isLoading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  if (error) return <p className="text-center p-8">Error loading results: {(error as Error).message}</p>;
  
  const azData = azResult?.data;
  if (!azData) return <p className="text-center p-8">Could not load results.</p>;

  const { animes, currentPage, totalPages, hasNextPage } = azData;
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AZ-LIST</h1>
        <p className="text-sm text-muted-foreground">{azData.totalAnimes?.toLocaleString() || '...'} anime</p>
      </div>
      <AdvancedFilter />
      <AZNav activeChar={displayCharacter} />
      
      {animes && animes.length > 0 ? (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            {animes.map((anime: any) => (
                <AnimeCard key={anime.id} anime={anime} />
            ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} />
        </>
      ) : (
        !isLoading && <p className="text-center text-muted-foreground mt-16">No anime found for this filter.</p>
      )}
    </div>
  );
}

export default function AZListPage({ params }: { params: { character: string } }) {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>}>
            <AZListPageComponent params={params} />
        </Suspense>
    )
}
