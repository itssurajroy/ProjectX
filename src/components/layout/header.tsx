
'use client';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Home, LayoutGrid, Menu, Shuffle, Rss, MessagesSquare, Calendar, Wand2, User, LogOut, Tv, Film, Star, Clock, ChevronDown, Book, Newspaper, Users, Info, TrendingUp,Languages, Sun, Moon, Send, Twitter, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { HomeData, SearchSuggestionResponse } from '@/types/anime';
import Image from 'next/image';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '../ui/skeleton';
import { genres } from '@/lib/data';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';

const NavLink = ({ href, children, className, onClick }: { href: string, children: React.ReactNode, className?: string, onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} onClick={onClick} className={cn("flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md", isActive ? "text-primary bg-primary/10" : "text-gray-300 hover:text-white hover:bg-white/10", className)}>
            {children}
        </Link>
    );
};

const SocialLink = ({ href, icon: Icon, name }: { href: string, icon: React.ElementType, name: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-card/80 rounded-full hover:bg-muted transition-colors" title={name}>
        <Icon className="w-4 h-4" />
    </a>
)


export default function Header() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
  };

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

  const suggestions = suggestionsResult && 'data' in suggestionsResult ? suggestionsResult.data.suggestions : [];
  
  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/movies", icon: Film, label: "Movies" },
    { href: "/tv", icon: Tv, label: "TV Series" },
    { href: "/top-airing", icon: TrendingUp, label: "Top Airing" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-40 h-16 flex items-center bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <Link href="/home" className="text-2xl font-bold text-glow mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="text-primary">Project</span>
                      <span className="text-white">X</span>
                  </Link>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-4">
                   {navItems.map(item => (
                     <NavLink key={item.href} href={item.href} className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                       <item.icon className="w-4 h-4" /> {item.label}
                     </NavLink>
                   ))}
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn("flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 w-full justify-start")}>
                        <LayoutGrid className="w-4 h-4"/> Genres <ChevronDown className="w-4 h-4 ml-auto" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="grid grid-cols-2 w-64 bg-card/95 backdrop-blur-sm">
                      {genres.map(genre => (
                        <DropdownMenuItem key={genre} asChild>
                          <Link href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`} onClick={() => setIsMobileMenuOpen(false)}>{genre}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/home" className="text-2xl font-bold text-glow hidden sm:block">
                <span className="text-primary">Project</span>
                <span className="text-white">X</span>
            </Link>
        </div>
        
        <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => <NavLink key={item.href} href={item.href}><item.icon className="w-4 h-4"/> {item.label}</NavLink>)}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10")}>
                  <LayoutGrid className="w-4 h-4"/> Genres <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="grid grid-cols-4 w-[600px] bg-card/95 backdrop-blur-sm">
                {genres.map(genre => (
                  <DropdownMenuItem key={genre} asChild>
                    <Link href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}>{genre}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </nav>

        <div className="flex-1 flex justify-end items-center gap-2">
            <div ref={searchContainerRef} className="flex-1 max-w-xs relative">
              <form onSubmit={handleSearch} className="relative">
                  <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search anime..."
                      className="bg-card/80 w-full rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Search className="w-4 h-4 text-gray-400 hover:text-white" />
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
            
            <Link href="/random" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-card/80 hover:bg-muted" title="Random Anime">
                <Shuffle className="w-4 h-4" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-card/80 hover:bg-muted" title="Language & Theme">
                  <Languages className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Languages className="mr-2 h-4 w-4" />
                    <span>Language</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>English</DropdownMenuItem>
                      <DropdownMenuItem>Japanese</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                 <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Light</DropdownMenuItem>
                      <DropdownMenuItem>Dark</DropdownMenuItem>
                      <DropdownMenuItem>System</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center gap-2">
              <SocialLink href="https://discord.com" icon={Send} name="Discord" />
              <SocialLink href="https://x.com" icon={Twitter} name="Twitter" />
            </div>

            {isClient && (
                  <>
                      {isUserLoading ? (
                        <Skeleton className="w-9 h-9 rounded-full" />
                      ) : user && !user.isAnonymous ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary">
                                    <Image src={user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} alt="User Avatar" width={36} height={36} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuLabel>
                                 <p className="font-semibold text-sm truncate">{user.displayName}</p>
                                 <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                               </DropdownMenuLabel>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem asChild><Link href="/profile" className='cursor-pointer'><User className="mr-2 h-4 w-4"/>Profile</Link></DropdownMenuItem>
                               <DropdownMenuItem asChild><Link href="/watchlist" className='cursor-pointer'><Book className="mr-2 h-4 w-4"/>Watchlist</Link></DropdownMenuItem>
                               <DropdownMenuItem onSelect={handleSignOut} className="text-destructive cursor-pointer">
                                 <LogOut className="mr-2 h-4 w-4" /> Sign Out
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                      ) : (
                         <button onClick={handleSignIn} className="hidden sm:flex items-center gap-2 p-2 px-3 bg-card/80 rounded-lg font-semibold text-sm hover:bg-muted transition-colors">
                            <User className="w-4 h-4 text-primary" /> Sign In
                        </button>
                      )}
                  </>
              )}
        </div>
      </div>
    </header>
  );
}

    
