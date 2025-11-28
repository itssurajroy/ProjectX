'use client';

import { AnimeService } from '@/lib/AnimeService';
import { AnimeBase, SpotlightAnime, HomeData, ScheduleResponse, Top10Anime } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Play, Bookmark, Clapperboard, Search, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from '@/components/ui/button';

const SpotlightSection = () => {
    const { data: homeDataResult } = useQuery<{data: HomeData} | { success: false; error: string }>({
        queryKey: ['homeData'],
        queryFn: AnimeService.getHomeData,
    });

    const randomAnime = homeDataResult && !('success' in homeDataResult) && homeDataResult.data.trendingAnimes?.[0];

    return (
        <div className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center -mt-16">
            <div className="absolute inset-0">
                <Image
                    src="https://picsum.photos/seed/anime/1200/400"
                    alt="Anime collage"
                    fill
                    className="object-cover opacity-20 blur-sm"
                    data-ai-hint="anime"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            </div>
            <div className="relative z-10 text-center px-4 animate-banner-fade-in">
                <div className="relative max-w-2xl mx-auto mb-4">
                     <input 
                        type="text" 
                        placeholder="Search anime..."
                        className="w-full bg-background/50 backdrop-blur-sm border border-border rounded-full py-3 pl-6 pr-24 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-card/80 text-card-foreground px-4 py-2 rounded-full font-semibold hover:bg-card/90 transition-colors">
                        <SlidersHorizontal className="w-4 h-4" /> Filter
                    </button>
                </div>
                {randomAnime && (
                    <>
                        <p className="text-muted-foreground text-sm mb-4">
                            Trending: <Link href={`/anime/${randomAnime.id}`} className="text-foreground hover:text-primary">{randomAnime.name}</Link>
                        </p>
                        <Button asChild size="lg" className="shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform">
                            <Link href={`/anime/${randomAnime.id}`}>
                                <Play className="w-5 h-5 mr-2" /> Watch Now
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

const SiteInfoSection = () => (
    <div className="max-w-4xl mx-auto space-y-8 text-muted-foreground">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">The Best Site to Watch Anime Online for Free</h1>
            <p>
                Anime is not just about stories drawn with pen strokes; it's a gateway to worlds full of emotions and creativity. From intense battles to unforgettable romantic moments, anime has become an essential part of entertainment for millions of people. With its growing popularity, the number of free anime streaming platforms continues to rise.
            </p>
            <p className="mt-2">
                However, not every site can truly satisfy fans. Some stand out as guiding lights in the vast ocean. That's why ProjectX was created — a global home for anime enthusiasts, with the mission to become one of the top free anime streaming sites!
            </p>
        </div>

        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-primary mb-2">1. What is ProjectX?</h2>
                <p>
                    ProjectX is a free anime streaming site where you can watch anime in HD quality with both subbed and dubbed options, all without the hassle of registration or payment. And the best part? There are absolutely no ads! We're dedicated to making it the safest and most enjoyable place for anime lovers to watch anime for free.
                </p>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-primary mb-2">2. What makes ProjectX the best site to watch anime free online?</h2>
                <p>Before creating ProjectX, we thoroughly explored numerous other free anime sites and learned from their strengths and weaknesses. We kept only the best features and eliminated all the drawbacks, combining them into our platform. That's why we're so confident in claiming to be the best site for anime streaming. Experience it yourself and see the difference!</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                    <li><strong className="text-foreground">Safety:</strong> No ads, no redirects, and absolutely no viruses. Your safety and enjoyment are our top priorities.</li>
                    <li><strong className="text-foreground">Content Library:</strong> We offer an extensive collection of anime, spanning from 1980s classics to the latest releases.</li>
                    <li><strong className="text-foreground">Quality/Resolution:</strong> All anime on ProjectX is available in the best possible resolution. Stream at 360p when your connection is slow or enjoy stunning 720p or 1080p.</li>
                    <li><strong className="text-foreground">Streaming Experience:</strong> Faster loading speeds and a completely buffer-free experience.</li>
                    <li><strong className="text-foreground">User Interface:</strong> Our user-friendly UI and UX design make navigation a breeze for everyone.</li>
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-primary mb-2">3. How does ProjectX compare to 9Anime, Aniwave, and GogoAnime?</h2>
                <p>
                    We are a new website, so our library is constantly growing. With access to multiple private trackers, we are confident that we will surpass others. We have a more modern layout and better UI/UX, making navigation on our site easy and convenient.
                </p>
            </div>
            <p className="text-center pt-4">
                If you're searching for a reliable and safe site for anime streaming, give ProjectX a try. If you enjoy your time with us, please spread the word and don't forget to bookmark our site! Your support means the world to us. Thank you!
            </p>
        </div>
    </div>
);


export default function MainDashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <SpotlightSection />
      
      <main className="px-4 sm:px-6 lg:px-8 mt-12 mb-12 space-y-8">
        <SiteInfoSection />
      </main>
    </div>
  );
}
