
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Twitter, Send, Rss, Shuffle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Balancer from "react-wrap-balancer";
import { AnimeBase, HomeData, SearchSuggestion } from "@/lib/types/anime";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from '@/lib/services/AnimeService';
import ProgressiveImage from "@/components/ProgressiveImage";

const socialLinks = [
    { name: "Discord", count: "82.6k", icon: Send, color: "bg-blue-600", href: "https://discord.gg/nHwCpPx9yy" },
    { name: "Telegram", count: "14.5k", icon: Send, color: "bg-sky-500", href: "#" },
    { name: "Twitter", count: "11.6k", icon: Twitter, color: "bg-sky-400", href: "#" },
    { name: "Reddit", count: "12.7k", icon: Rss, color: "bg-orange-600", href: "#" },
];

export default function LandingPage() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const searchContainerRef = useRef<HTMLDivElement>(null);


    const { data: homeData } = useQuery<HomeData>({
        queryKey: ['homeData'],
        queryFn: AnimeService.home,
    });
    
    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        const fetchSuggestions = async () => {
            const data = await AnimeService.getSearchSuggestions(query);
            setSuggestions(data.suggestions || []);
            setShowSuggestions(true);
        };
        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const trendingAnimes = (homeData?.trendingAnimes || []).slice(0, 5);
    const topTrendingAnime = homeData?.trendingAnimes?.[0];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim()) {
            router.push(`/search?q=${query.trim()}`);
            setShowSuggestions(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 min-h-[60vh] overflow-hidden">
                    <div className="absolute inset-0 z-0 h-full w-full">
                        <ProgressiveImage 
                            src={topTrendingAnime?.poster || "https://picsum.photos/seed/anime-collage/1920/1080"} 
                            alt={topTrendingAnime?.name || "Anime Collage"} 
                            fill 
                            priority 
                            className="object-cover opacity-70 blur-sm" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background"></div>
                    </div>
                    <div className="relative z-10 container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-glow mb-4">
                           <Balancer>Find Your Favorite Anime</Balancer>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            <Balancer>
                                ProjectX is the ultimate destination to watch anime online for free, with subbed or dubbed options in HD and no ads.
                            </Balancer>
                        </p>

                        <div ref={searchContainerRef} className="max-w-2xl mx-auto mb-4 relative">
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input 
                                        id="landing-page-search"
                                        name="q"
                                        type="search"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onFocus={() => query.length > 2 && setShowSuggestions(true)}
                                        placeholder="Search anime..."
                                        className="w-full h-14 pl-12 pr-32 rounded-full bg-card/80 border-2 border-border focus:ring-primary focus:border-primary text-lg"
                                    />
                                    <Button type="submit" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 rounded-full flex items-center gap-2">
                                        Filter <ChevronDown className="w-4 h-4"/>
                                    </Button>
                                </div>
                            </form>
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-card rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto border border-border text-left">
                                    {suggestions.map(anime => (
                                    <Link key={anime.id} href={`/anime/${anime.id}`} onClick={() => { setQuery(''); setShowSuggestions(false); }} className="w-full text-left flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors">
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
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground max-w-xl mx-auto">
                            <span>Trending:</span>
                            {trendingAnimes.map((anime: AnimeBase) => (
                                <Link key={anime.id} href={`/anime/${anime.id}`} className="hover:text-primary hover:underline">
                                    {anime.name}
                                </Link>
                            ))}
                        </div>

                         <div className="mt-8">
                             <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform" onClick={() => router.push('/home')}>
                                View Full Site <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </section>
                
                <div className="container mx-auto px-4">
                    {/* Social Proof */}
                    <section className="-mt-12 mb-16 relative z-10">
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {socialLinks.map(link => (
                                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-4 py-2 rounded-lg text-white font-semibold text-sm ${link.color} transition-transform hover:scale-105`}>
                                    {link.icon && <link.icon className="w-5 h-5"/>}
                                    <span>{link.name}</span>
                                    <span className="text-white/70">{link.count}</span>
                                </a>
                            ))}
                        </div>
                    </section>
                    
                    <div className="flex justify-center my-16">
                        <Link href="/random"
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-1 shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                          <div className="flex items-center gap-3 px-8 py-5 bg-black rounded-2xl transition-all group-hover:bg-black/80">
                              <Shuffle className="w-7 h-7 text-white animate-pulse" />
                              <span className="text-2xl font-black text-white bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                                RANDOM ANIME
                              </span>
                              <Sparkles className="w-6 h-6 text-yellow-400 animate-ping" />
                          </div>
                           <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-cyan-500 blur-3xl opacity-70 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>


                    {/* SEO Content Section */}
                    <section className="py-16">
                        <div className="max-w-4xl mx-auto text-left space-y-8 text-muted-foreground text-sm">
                            <h2 className="text-2xl font-bold text-center text-foreground mb-10">The Best Site to Watch Anime Online for Free</h2>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-primary">What is ProjectX?</h3>
                                <p>ProjectX is a free anime streaming site where you can watch anime in HD quality with both subbed and dubbed options, all without the hassle of registration or payment. And the best part? There are absolutely no ads! We're dedicated to making it the safest and most enjoyable place for anime lovers to watch anime for free.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-primary">Is ProjectX safe?</h3>
                                <p>Yes. We are a new website, but we have a team of dedicated people who are committed to providing the best and safest anime streaming experience for our users. We do not have any ads on our website, and we do not require any registration to watch anime. You can come and watch your favorite anime without any worries.</p>
                            </div>
                             <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-primary">What makes ProjectX the best site to watch anime free online?</h3>
                                <p>Before creating ProjectX, we thoroughly explored numerous other free anime sites and learned from their strengths and weaknesses. We kept only the best features and eliminated all the drawbacks, combining them into our platform. That's why we're so confident in claiming to be the best site for anime streaming. Experience it yourself and see the difference!</p>
                                <ul className="list-disc list-inside space-y-2 pl-4">
                                    <li><strong>Safety:</strong> No ads, no redirects, and absolutely no viruses. Your safety and enjoyment are our top priorities.</li>
                                    <li><strong>Content Library:</strong> We offer an extensive collection of anime, spanning from 1980s classics to the latest releases.</li>
                                    <li><strong>Quality/Resolution:</strong> All anime on ProjectX is available in the best possible resolution, including 720p and 1080p.</li>
                                    <li><strong>Streaming Experience:</strong> We offer faster loading speeds and a completely buffer-free experience.</li>
                                    <li><strong>User Interface:</strong> Our user-friendly UI and UX design make navigation a breeze for everyone.</li>
                                    <li><strong>Device Compatibility:</strong> ProjectX works seamlessly on both mobile and desktop devices.</li>
                                </ul>
                            </div>
                             <div className="space-y-2">
                                <p>If you're searching for a reliable and safe site for anime streaming, give ProjectX a try. If you enjoy your time with us, please spread the word and don't forget to bookmark our site! Your support means the world to us.</p>
                                <p>Thank you!</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
