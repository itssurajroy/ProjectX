
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimeService } from '@/lib/AnimeService';
import { AnimeCard } from '@/components/AnimeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface Filters {
  query: string;
  type: string;
  status: string;
  season: string;
  language: string;
  rated: string;
  score: string;
  genres: string[];
  sort: string;
  page: number;
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


export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const [filters, setFilters] = useState<Filters>({
    query: q,
    type: '',
    status: '',
    season: '',
    language: '',
    rated: '',
    score: '',
    genres: [],
    sort: 'most_relevance',
    page: 1
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Search when query changes
  useEffect(() => {
    if (filters.query.length > 2) {
      const timer = setTimeout(async () => {
        const res = await AnimeService.search(filters.query);
        setSuggestions(res?.suggestions?.slice(0, 10).map((s: any) => s.name) || []);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [filters.query]);

  // Main search
  const performSearch = async (page = 1) => {
    if (!filters.query.trim()) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('q', filters.query);
      params.set('page', page.toString());
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      if (filters.season) params.set('season', filters.season);
      if (filters.language) params.set('language', filters.language);
      if (filters.rated) params.set('rated', filters.rated);
      if (filters.score) params.set('score', filters.score);
      if (filters.genres.length) params.set('genres', filters.genres.join(','));
      if (filters.sort) params.set('sort', filters.sort);

      const res = await AnimeService.search(params.toString());
      
      if (page === 1) {
        setResults(res.animes || []);
      } else {
        setResults(prev => [...prev, ...(res.animes || [])]);
      }
      
      setHasMore(res.hasNextPage || false);
      setFilters(prev => ({ ...prev, page }));
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setFilters(prev => ({ ...prev, query: initialQuery }));
      performSearch(1);
    }
  }, [searchParams]);

  const loadMore = () => {
    performSearch(filters.page + 1);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Search Anime</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value, page: 1 }))}
            onKeyDown={(e) => e.key === 'Enter' && performSearch(1)}
            placeholder="Search anime, movies, OVA..."
            className="w-full px-6 py-4 bg-card/50 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl z-50 border border-border">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, query: s }));
                    setSuggestions([]);
                    performSearch(1);
                  }}
                  className="px-6 py-3 hover:bg-muted cursor-pointer"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 p-4 bg-card/50 rounded-lg border border-border">
          <select onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))} className="px-4 py-3 bg-muted rounded-lg border-none focus:ring-2 focus:ring-primary">
            <option value="">All Types</option>
            <option value="tv">TV</option>
            <option value="movie">Movie</option>
            <option value="ova">OVA</option>
            <option value="special">Special</option>
          </select>

          <select onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} className="px-4 py-3 bg-muted rounded-lg border-none focus:ring-2 focus:ring-primary">
            <option value="">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <select onChange={(e) => setFilters(prev => ({ ...prev, season: e.target.value }))} className="px-4 py-3 bg-muted rounded-lg border-none focus:ring-2 focus:ring-primary">
            <option value="">All Seasons</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
          </select>

          <select onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))} className="px-4 py-3 bg-muted rounded-lg border-none focus:ring-2 focus:ring-primary">
            <option value="most_relevance">Most Relevant</option>
            <option value="recently_updated">Recently Updated</option>
            <option value="recently_added">Recently Added</option>
            <option value="most_popular">Most Popular</option>
            <option value="score">Score</option>
          </select>

          <Button onClick={() => performSearch(1)} className="col-span-2 md:col-span-4 lg:col-span-2 px-8 py-3 rounded-lg font-bold text-base h-auto">
            Apply Filters
          </Button>
        </div>

        {/* Results */}
        {loading && results.length === 0 ? <LoadingSkeleton /> 
        : results.length > 0 ? (
            <>
                <div className="grid-cards">
                    {results.map((anime: any) => (
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                </div>
                {hasMore && (
                    <div className="text-center py-10">
                        <Button onClick={loadMore} disabled={loading} size="lg">
                            {loading ? "Loading..." : "Load More"}
                        </Button>
                    </div>
                )}
            </>
        ) : q && !loading ? (
             <div className="text-center py-20 text-muted-foreground">No results found for "{q}"</div>
        ) : null}
      </div>
    </div>
  );
}
