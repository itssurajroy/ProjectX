
'use client';

import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { genres, seasons, sortOptions, types, years } from "@/lib/data";
import { AnimeService } from "@/lib/AnimeService";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import ErrorDisplay from "@/components/common/ErrorDisplay";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 500);

  const { data: searchResult, isLoading, error, refetch } = useQuery({
      queryKey: ['search', debouncedQuery],
      queryFn: () => AnimeService.searchAnime(debouncedQuery),
      enabled: !!debouncedQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.replace(`${window.location.pathname}?${params.toString()}`);
  }

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return <ErrorDisplay onRetry={refetch} description="Could not perform search. Please try again."/>
    }

    const filteredMedia = searchResult && 'animes' in searchResult ? searchResult.animes : [];

    if (filteredMedia.length > 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                {filteredMedia.map((item) => (
                    <AnimeCard key={item.id} anime={item} />
                ))}
            </div>
        );
    }
    
    return (
        <div className="text-center py-16">
            <h3 className="text-xl font-semibold">{debouncedQuery ? 'No results found' : 'Start typing to search'}</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <form onSubmit={handleSearch}>
        <div className="bg-card p-4 rounded-lg border mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Input 
              placeholder="Search..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="col-span-2 lg:col-span-3" 
            />
            <Select>
              <SelectTrigger><SelectValue placeholder="Genre" /></SelectTrigger>
              <SelectContent>{genres.map(g => <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>)}</SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Season" /></SelectTrigger>
              <SelectContent>{seasons.map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>{types.map(t => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
              <SelectContent>{sortOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <Button type="submit" className="col-span-2 lg:col-span-1">
              <SearchIcon className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>
        </div>
      </form>

      <div>
        <h2 className="text-2xl font-bold mb-4">{debouncedQuery ? `Results for "${debouncedQuery}"` : 'Search for shows'}</h2>
        {renderContent()}
      </div>
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    )
}
