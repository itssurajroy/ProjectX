
'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Menu, Shuffle, X, Users, Bell, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SearchSuggestion } from '@/lib/types/anime';
import { genres } from '@/lib/data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import SiteLogo from './SiteLogo';
import { AnimeService } from '@/lib/services/AnimeService';
import ProgressiveImage from '../ProgressiveImage';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useUser } from '@/firebase/auth/use-user';
import { auth } from '@/firebase/client';
import toast from 'react-hot-toast';

function UserAuth() {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    toast.success("Signed out successfully.");
    router.push('/home');
  };


  if (loading) {
      return <Loader2 className="w-6 h-6 animate-spin" />;
  }

  if (user && userProfile) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfile.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} alt={userProfile.displayName} />
                        <AvatarFallback>{userProfile.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/dashboard/watchlist">Watchlist</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  return (
    <Button asChild>
        <Link href="/login">Login</Link>
    </Button>
  )
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const data = await AnimeService.getSearchSuggestions(searchQuery);
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);


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
  
  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv", label: "TV Shows" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
            <SiteLogo />
            <nav className="hidden lg:flex items-center gap-4">
                {navItems.map(item => (
                    <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>

        <div className="flex-1 flex justify-center items-center gap-2 lg:ml-8">
            <div ref={searchContainerRef} className="w-full max-w-lg relative">
              <form onSubmit={handleSearch} className="relative">
                  <Input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                      placeholder="Search anime..."
                      className="bg-card w-full rounded-full h-11 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base transition-all hidden md:block"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-transparent rounded-full flex items-center justify-center text-muted-foreground hover:text-primary md:hidden">
                      <Search className="w-5 h-5" />
                  </button>
              </form>
               {showSuggestions && searchQuery.length > 0 && (
                 <div className="absolute top-full mt-2 w-full bg-card rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto border border-border">
                    {isLoading ? (
                      <div className="p-4 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline-block"/></div>
                    ) : suggestions.length > 0 ? suggestions.map(anime => (
                      <Link key={anime.id} href={`/anime/${anime.id}`} onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} className="w-full text-left flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors">
                        <div className="relative w-10 h-14 flex-shrink-0">
                           <ProgressiveImage 
                              src={anime.poster} 
                              alt={anime.name || "Anime Poster"}
                              fill
                              className="rounded-md object-cover" 
                            />
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
          {mounted && (
            <>
              <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
                <Link href="/watch2gether" title="Watch Together">
                  <Users className="w-5 h-5 text-primary" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" title="Notifications"><Link href="/dashboard/notifications"><Bell className="w-5 h-5" /></Link></Button>
              <Button asChild variant="ghost" size="icon">
                <Link href="/random" title="Random Anime">
                  <Shuffle className="w-5 h-5 text-primary" />
                </Link>
              </Button>
            </>
          )}
          
          <UserAuth />
          
        </div>
      </div>
    </header>
  );
}
