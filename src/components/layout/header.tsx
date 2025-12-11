
'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Menu, Shuffle, X, LogOut, User as UserIcon, Shield, Bookmark, Users, Bell, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SearchSuggestion } from '@/types/anime';
import { genres } from '@/lib/data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import NotificationBell from '../notifications/NotificationBell';
import { useUser, useAuth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import SiteLogo from './SiteLogo';
import { AnimeService } from '@/lib/AnimeService';
import ProgressiveImage from '../ProgressiveImage';

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const navItems = [
      { href: "/home", label: "Home" },
      { href: "/movies", label: "Movies" },
      { href: "/tv", label: "TV Shows" },
    ];
    
    return (
        <div className={cn("fixed inset-0 z-50 flex lg:hidden", isOpen ? "pointer-events-auto" : "pointer-events-none")}>
            {/* Overlay */}
            <div 
                onClick={onClose}
                className={cn(
                    "absolute inset-0 bg-black/80 transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
            />
            {/* Menu Panel */}
            <div className={cn("relative z-10 w-full max-w-xs bg-background border-r border-border h-full flex flex-col transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "-translate-x-full")}>
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <SiteLogo />
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <nav className="flex flex-col gap-2 mt-4 p-4 overflow-y-auto">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className="text-lg font-medium p-2 rounded-md hover:bg-muted" onClick={onClose}>
                        {item.label}
                        </Link>
                    ))}
                    <div className="space-y-1 pt-4">
                        <h3 className="px-2 text-sm font-semibold text-muted-foreground">Genres</h3>
                        <div className="max-h-64 overflow-y-auto">
                            {genres.map(genre => (
                            <Link key={genre} href={`/search?genres=${genre.toLowerCase().replace(/ /g, '-')}`} onClick={onClose} className="block p-2 text-base font-medium rounded-md hover:bg-muted">
                                {genre}
                            </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

function UserProfileMenu() {
  const { user, profile } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut();
  };

  if (!user) return null;

  return (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 ring-2 ring-primary/50">
                    <AvatarImage src={user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} alt={user.displayName || 'user'} />
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.isAnonymous ? 'Guest User' : (user.displayName || 'User')}</p>
                {!user.isAnonymous && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                {profile && profile.role === 'admin' && <Badge variant="destructive" className="mt-1 w-fit">Admin</Badge>}
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
            </DropdownMenuItem>
            {profile && profile.role === 'admin' && (
                 <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
     </DropdownMenu>
  )
}

function UserAuth() {
  const { user, isUserLoading } = useUser();
  
  if (isUserLoading) {
    return <div className="w-20 h-9 bg-muted/50 rounded-md animate-pulse" />;
  }

  if (user) {
    return <UserProfileMenu />;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            {mounted && (
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            )}
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
                      className="bg-card w-full rounded-full h-11 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-transparent rounded-full flex items-center justify-center text-muted-foreground hover:text-primary">
                      <Search className="w-4 h-4" />
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
              <NotificationBell />
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
      {mounted && <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
    </header>
  );
}
