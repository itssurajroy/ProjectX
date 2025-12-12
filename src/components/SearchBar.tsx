
// components/SearchBar.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { AnimeService } from '@/lib/services/AnimeService';
import { SearchSuggestion } from '@/lib/types/anime';
import ProgressiveImage from './ProgressiveImage';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const fetchSuggestions = async () => {
        try {
            const data = await AnimeService.getSearchSuggestions(debouncedQuery);
            setResults(data.suggestions || []);
            setOpen(true);
        } catch (error) {
            console.error("Failed to fetch search suggestions", error);
            setResults([]);
        }
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-96" ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search anime..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      {open && results.length > 0 && (
        <div 
          className="absolute top-full mt-2 w-full bg-gray-950/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
        >
          {results.slice(0, 8).map((anime: any) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              onClick={() => { setOpen(false); setQuery(''); }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/10 transition"
            >
              <div className="relative w-12 h-16 rounded-lg overflow-hidden">
                <ProgressiveImage src={anime.poster} alt={anime.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold">{anime.name}</p>
                <p className="text-xs text-gray-400">
                  {anime.moreInfo?.join(' • ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
