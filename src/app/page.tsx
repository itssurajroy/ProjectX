
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Twitter, Send, Tv, Film } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Balancer from "react-wrap-balancer";
import AZList from "@/components/layout/az-list-footer";
import { AnimeBase, HomeData } from "@/types/anime";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/AnimeService";

const socialLinks = [
    { name: "Discord", count: "82.6k", icon: Send, color: "bg-[#5865F2]", href: "#" },
    { name: "Telegram", count: "14.5k", icon: Send, color: "bg-[#2AABEE]", href: "#" },
    { name: "Twitter", count: "11.6k", icon: Twitter, color: "bg-[#1DA1F2]", href: "#" },
    { name: "Reddit", count: "12.7k", icon: Film, color: "bg-[#FF4500]", href: "#" },
];

export default function LandingPage() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const { data: homeDataResult } = useQuery<{data: HomeData} | { success: false; error: string }>({
        queryKey: ['homeData'],
        queryFn: AnimeService.getHomeData,
    });
    
    const trendingAnimes = homeDataResult && !('success' in homeDataResult) ? homeDataResult.data.trendingAnimes.slice(0, 5) : [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim()) {
            router.push(`/search?q=${query.trim()}`);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 min-h-[60vh] overflow-hidden">
                    <div className="absolute inset-0 z-0 h-full w-full">
                        <img src="https://picsum.photos/seed/anime-collage/1920/1080" data-ai-hint="anime collage" alt="Anime Collage" className="object-cover w-full h-full opacity-10 blur-sm" />
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

                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input 
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search anime..."
                                    className="w-full h-14 pl-12 pr-32 rounded-full bg-card/80 border-2 border-border focus:ring-primary focus:border-primary text-lg"
                                />
                                <Button type="submit" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 rounded-full flex items-center gap-2">
                                    Filter <ChevronDown className="w-4 h-4"/>
                                </Button>
                            </div>
                        </form>
                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground max-w-xl mx-auto">
                            <span>Trending:</span>
                            {trendingAnimes.map((anime: AnimeBase) => (
                                <Link key={anime.id} href={`/anime/${anime.id}`} className="hover:text-primary hover:underline">
                                    {anime.name}
                                </Link>
                            ))}
                        </div>

                         <div className="mt-8">
                            <Button size="lg" className="h-12 px-8 text-lg font-bold" onClick={() => router.push('/home')}>
                                Start Watching
                            </Button>
                        </div>
                    </div>
                </section>
                
                {/* Social Proof */}
                <section className="container mx-auto px-4 -mt-12 mb-16 relative z-10">
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


                {/* SEO Content Section */}
                <section className="container mx-auto px-4 py-16">
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
            </main>
        </div>
    );
}
