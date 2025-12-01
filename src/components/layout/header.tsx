
'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Menu, Shuffle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { SearchSuggestionResponse } from '@/types/anime';
import Image from 'next/image';
import { genres } from '@/lib/data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import NotificationBell from '../notifications/NotificationBell';
import { AnimeService } from '@/lib/AnimeService';

const SiteLogo = () => (
    <Link href="/home" className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
              <path d="M12.25 2.016c-.82.01-1.63.1-2.42.24.48.17.93.39 1.35.63.4.24.78.52 1.13.84.7.64 1.25 1.44 1.63 2.34.38.9.57 1.86.57 2.84s-.2 1.94-.58 2.84c-.38.9-1 1.7-1.67 2.35-.67.64-1.45 1.15-2.3 1.5l.22.1a12.42 12.42 0 0 1-2.42 1.12 12.28 12.28 0 0 1-2.7 0c-.8-.23-1.57-.54-2.28-.9a12.42 12.42 0 0 1-2.42-1.12l.22-.1c-.85-.35-1.63-.86-2.3-1.5-.67-.65-.2-1.45-1.67-2.35-.38-.9-.58-1.85-.58-2.84s.2-1.95.58-2.85c-.38-.9-1-1.7-1.67-2.34-.67-.65-1.45-1.16-2.3-1.5a12.28 12.28 0 0 0 2.7 0c-.8.22-1.57.53-2.28.9-.45.2-.88.45-1.3.73l-.07.05c.42-.24-.87-.46-1.35-.63-.8-.15-1.6-.23-2.42-.24z"/>
              <path d="M12.25 2.016c.82.01 1.63.1 2.42.24-.48.17-.93.39-1.35.63-.4.24-.78.52-1.13.84-.7.64-1.25 1.44-1.63 2.34-.38.9-.57 1.86-.57 2.84s.2 1.94.58 2.84c.38.9 1 1.7 1.67 2.35.67.64 1.45 1.15 2.3 1.5l-.22.1a12.42 12.42 0 0 0 2.42 1.12 12.28 12.28 0 0 0 2.7 0c.8-.23 1.57-.54 2.28-.9a12.42 12.42 0 0 0 2.42-1.12l-.22-.1c.85-.35 1.63-.86 2.3-1.5.67-.65 1.22-1.45 1.67-2.35.38-.9.58-1.85.58-2.84s-.2-1.95-.58-2.85c-.38-.9-1-1.7-1.67-2.34-.67-.65-1.45-1.16-2.3-1.5a12.28 12.28 0 0 0-2.7 0c-.8.22-1.57.53-2.28.9-.45.2-.88.45-1.3.73l-.07.05c-.42-.24-.87-.46-1.35-.63-.8-.15-1.6-.23-2.42-.24z"/>
          </svg>
      </div>
      <span className="text-2xl font-bold text-white hidden sm:inline">ProjectX</span>
    </Link>
)

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const navItems = [
      { href: "/home", label: "Home" },
      { href: "/movies", label: "Movies" },
      { href: "/tv", label: "TV Shows" },
      { href: "/az-list/all", label: "A-Z List" },
    ];
    
    return (
        <div className={cn("fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out lg:hidden", isOpen ? "translate-x-0" : "-translate-x-full")}>
            <div className="p-4 border-b border-border flex items-center justify-between">
                <SiteLogo />
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                </Button>
            </div>
            <nav className="flex flex-col gap-2 mt-4 p-4">
               {navItems.map(item => (
                 <Link key={item.href} href={item.href} className="text-lg font-medium p-2 rounded-md hover:bg-muted" onClick={onClose}>
                   {item.label}
                 </Link>
               ))}
                <div className="space-y-1 pt-4">
                    <h3 className="px-2 text-sm font-semibold text-muted-foreground">Genres</h3>
                    <div className="max-h-64 overflow-y-auto">
                        {genres.map(genre => (
                        <Link key={genre} href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`} onClick={onClose} className="block p-2 text-base font-medium rounded-md hover:bg-muted">
                            {genre}
                        </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: suggestionsResult } = useQuery<SearchSuggestionResponse>({
      queryKey: ['searchSuggestions', searchQuery],
      queryFn: () => AnimeService.search(searchQuery),
      enabled: searchQuery.length > 2,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const suggestions = suggestionsResult?.suggestions || [];
  
  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv", label: "TV Shows" },
    { href: "/az-list/all", label: "A-Z List" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden lg:block">
                <SiteLogo />
            </div>
        </div>

        <nav className="hidden lg:flex items-center gap-4">
            {navItems.map(item => (
                <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                </Link>
            ))}
        </nav>
        
        <div className="flex-1 flex justify-center items-center gap-2 lg:ml-8">
            <div ref={searchContainerRef} className="w-full max-w-lg relative">
              <form onSubmit={handleSearch} className="relative">
                  <Input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search anime..."
                      className="bg-card w-full rounded-full h-11 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-transparent rounded-full flex items-center justify-center text-muted-foreground hover:text-primary">
                      <Search className="w-4 h-4" />
                  </button>
              </form>
               {showSuggestions && searchQuery.length > 2 && (
                 <div className="absolute top-full mt-2 w-full bg-card rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto border border-border">
                    {suggestions && suggestions.length > 0 ? suggestions.map(anime => (
                      <Link key={anime.id} href={`/anime/${anime.id}`} onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} className="w-full text-left flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors">
                        <div className="relative w-10 h-14 flex-shrink-0">
                           <Image src={anime.poster} alt={anime.name} fill sizes="40px" className="rounded-md object-cover" />
                        </div>
                        <div className='overflow-hidden'>
                            <p className="font-semibold truncate text-sm">{anime.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                                {anime.moreInfo.map(info => <span key={info}>{info}</span>)}
                            </div>
                        </div>
                      </Link>
                    )) : (
                      <div className="p-3 text-center text-sm text-muted-foreground">No suggestions found.</div>
                    )}
                 </div>
               )}
            </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <Link href="/random" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-card hover:bg-muted" title="Random Anime">
              <Shuffle className="w-4 h-4 text-primary" />
          </Link>

          <Button>Login</Button>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
