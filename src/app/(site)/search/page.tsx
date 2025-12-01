'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimeService } from '@/lib/AnimeService';
import { useDebounce } from 'use-debounce';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

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
  }
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
    <div
      onClick={() => (window.location.href = `/anime/${anime.id}`)}
      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
    >
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
    </div>
)

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<AnimeResult[]>([]);
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        try {
          const data = await AnimeService.request(`/search/suggestion?q=${encodeURIComponent(debouncedQuery)}`);
          setSuggestions(data?.suggestions?.slice(0, 8) || []);
        } catch {
          setSuggestions([]);
        }
        setLoadingSuggestions(false);
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  // Main search function
  const performSearch = useCallback(async (searchQuery: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await AnimeService.request(
        `/search?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`
      );

      const newResults = res.animes || [];

      if (pageNum === 1) {
        setResults(newResults);
      } else {
        setResults(prev => [...prev, ...newResults]);
      }

      setHasMore(res.hasNextPage || false);
      setPage(pageNum);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
      setHasMore(false);
    }
    setLoading(false);
  }, []);

  // Initial load from URL
  useEffect(() => {
    performSearch(initialQuery, 1);
  }, [initialQuery, performSearch]);

  // Infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          performSearch(query, page + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, page, query, performSearch]);
  
   // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestionQuery: string) => {
    setQuery(suggestionQuery);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestionQuery)}`);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 text-glow">
          Search Anime
        </h1>

        <div ref={searchContainerRef} className="relative max-w-3xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for anime, movies, characters..."
              className="w-full px-6 py-4 text-base bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-lg"
              autoFocus
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6"
            >
              Search
            </Button>
          </div>

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              {loadingSuggestions && (
                <div className="px-6 py-4 text-muted-foreground">Loading suggestions...</div>
              )}
              {!loadingSuggestions && suggestions.length > 0 && suggestions.map((anime, i) => (
                <div
                  key={i}
                  onClick={() => handleSuggestionClick(anime.name)}
                  className="px-4 py-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                     <div className="relative w-10 h-14 flex-shrink-0">
                       <Image src={anime.poster || '/placeholder.jpg'} alt={anime.name} fill className="rounded-md object-cover" />
                     </div>
                     <div>
                       <p className="font-semibold text-foreground text-sm">{anime.name}</p>
                       <p className="text-xs text-muted-foreground">{anime.type}</p>
                     </div>
                  </div>
                </div>
              ))}
              {!loadingSuggestions && suggestions.length === 0 && debouncedQuery.length > 1 && (
                  <div className="px-6 py-4 text-muted-foreground">No suggestions found.</div>
              )}
            </div>
          )}
        </div>

        {loading && results.length === 0 ? <LoadingSkeleton /> :
         results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
            {results.map((anime, index) => (
               <SearchResultCard key={`${anime.id}-${index}`} anime={anime} />
            ))}
            {/* Invisible element to trigger loading more */}
            <div ref={lastElementRef} />
          </div>
        ) : !loading && initialQuery ? (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">No anime found for "{initialQuery}"</p>
            <p className="text-gray-600 mt-4">Try searching with different keywords.</p>
          </div>
        ) : null}

        {loading && results.length > 0 && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
}
