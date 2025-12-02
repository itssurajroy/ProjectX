
// components/SearchBar.tsx
'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search/suggestion?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.data?.suggestions || []);
      setOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-96">
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
          onMouseLeave={() => setOpen(false)}
        >
          {results.slice(0, 8).map((anime: any) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              onClick={() => { setOpen(false); setQuery(''); }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/10 transition"
            >
              <img src={anime.poster} alt="" className="w-12 h-16 rounded-lg object-cover" />
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
