'use client';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Home, LayoutGrid, Menu, Shuffle, Rss, MessagesSquare, Calendar, Wand2, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { HomeData, SearchSuggestionResponse } from '@/types/anime';
import Image from 'next/image';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useUser } from '@/firebase';

export default function Header() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    setUserMenuOpen(false);
  };

  const { data: homeDataResult } = useQuery<{data: HomeData} | { success: false; error: string }>({
    queryKey: ['homeData'],
    queryFn: AnimeService.getHomeData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: suggestionsResult } = useQuery<{data: SearchSuggestionResponse} | { success: false; error: string }>({
      queryKey: ['searchSuggestions', searchQuery],
      queryFn: () => AnimeService.getSearchSuggestions(searchQuery),
      enabled: searchQuery.length > 2,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
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
  
  const handleRandomClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (homeDataResult && !(homeDataResult && typeof homeDataResult === 'object' && 'success' in homeDataResult)) {
      const animes = homeDataResult.data.trendingAnimes;
      if (animes && animes.length > 0) {
        const randomAnime = animes[Math.floor(Math.random() * animes.length)];
        router.push(`/watch/${randomAnime.id}`);
        setMobileMenuOpen(false);
      }
    }
  };

  const navLinks = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/genres', icon: LayoutGrid, label: 'Genres' },
    { href: '/seasonal', icon: Calendar, label: 'Seasonal' },
    { href: '/recommendations', icon: Wand2, label: 'For You' },
    { href: '#', icon: Shuffle, label: 'Random', onClick: handleRandomClick },
    { href: '/news', icon: Rss, label: 'News' },
    { href: '/community', icon: MessagesSquare, label: 'Community' },
  ];

  const suggestions = suggestionsResult && !('success' in suggestionsResult) ? suggestionsResult.data.suggestions : [];

  return (
    <nav className="flex items-center bg-background/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-border h-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6"/>
          </button>
          <Link href="/" className="text-2xl font-bold text-glow">
            <span className="text-primary">Project</span>
            <span className="text-white">X</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-4 ml-6 text-sm font-medium">
          {navLinks.slice(0,4).map(link => (
              <Link key={link.href + link.label} href={link.href} className="flex items-center gap-1.5 text-gray-300 hover:text-primary transition-colors px-2 py-1">
                <link.icon className="w-4 h-4" /> {link.label}
              </Link>
          ))}
        </div>

        <div ref={searchContainerRef} className="flex-1 max-w-sm lg:max-w-md mx-4 hidden sm:block relative">
          <form onSubmit={handleSearch} className="relative">
              <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search anime... 🧐"
                  className="bg-card/50 w-full rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
          </form>
           {showSuggestions && searchQuery.length > 2 && (
             <div className="absolute top-full mt-2 w-full bg-card rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
                {suggestions && suggestions.length > 0 ? suggestions.map(anime => (
                  <Link key={anime.id} href={`/watch/${anime.id}`} onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} className="w-full text-left flex items-center gap-4 p-3 hover:bg-muted/50 transition-colors">
                    <div className="relative w-12 h-16 flex-shrink-0">
                       <Image src={anime.poster} alt={anime.name} fill className="rounded-md object-cover" />
                    </div>
                    <div className='overflow-hidden'>
                        <p className="font-semibold truncate">{anime.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{anime.jname}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                            {anime.moreInfo.map(info => <span key={info}>{info}</span>)}
                        </div>
                    </div>
                  </Link>
                )) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No suggestions found.</div>
                )}
             </div>
           )}
        </div>
        
        <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
          {navLinks.slice(4).map(link => (
               <Link key={link.href + link.label} href={link.href} onClick={link.onClick} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors px-2 py-1">
                  <link.icon className="w-5 h-5"/>
                  <span className="text-xs">{link.label}</span>
              </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4 relative" ref={userMenuRef}>
          {isClient && (
              <>
                  {isUserLoading ? (
                    <div className="w-10 h-10 rounded-full bg-card animate-pulse"></div>
                  ) : user && !user.isAnonymous ? (
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2">
                        <Image src={user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} alt="User Avatar" width={36} height={36} className="rounded-full" />
                    </button>
                  ) : (
                     <button onClick={handleSignIn} className="flex items-center gap-2 p-2 px-4 bg-card/50 rounded-lg font-semibold text-sm hover:bg-muted/80 transition-colors">
                        <User className="w-4 h-4 text-primary" /> Sign In
                    </button>
                  )}

                  {userMenuOpen && user && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-lg shadow-xl py-1 z-20 border border-border animate-in fade-in-0 zoom-in-95">
                       <div className='px-4 py-2 border-b border-border'>
                         <p className="font-semibold text-sm truncate">{user.displayName}</p>
                         <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                       </div>
                        <button 
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                  )}
              </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("fixed top-16 left-0 h-[calc(100%-4rem)] w-full max-w-xs bg-background/95 backdrop-blur-lg z-40 transform transition-transform md:hidden", mobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
         <div className="p-4">
             <form onSubmit={handleSearch} className="relative mb-4">
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anime..."
                    className="bg-card/50 w-full rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
            </form>
            <div className="flex flex-col space-y-2">
                {navLinks.map(link => (
                    <Link key={link.href + link.label} href={link.href} className="flex items-center gap-3 p-3 text-gray-300 hover:bg-muted/50 rounded-md transition-colors" onClick={(e) => { link.onClick?.(e as any); setMobileMenuOpen(false); }}>
                        <link.icon className="w-5 h-5" /> {link.label}
                    </Link>
                ))}
            </div>
         </div>
      </div>
    </nav>
  );
}