
'use client';

import { AnimeService } from '@/lib/AnimeService';
import { AnimeBase, HomeData } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Play, Bookmark, Clapperboard, Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const SpotlightSection = () => {
    const { data: homeDataResult } = useQuery<{data: HomeData} | { success: false; error: string }>({
        queryKey: ['homeData'],
        queryFn: AnimeService.getHomeData,
    });

    const trendingAnimes = homeDataResult && !('success' in homeDataResult) && homeDataResult.data.trendingAnimes ? homeDataResult.data.trendingAnimes.slice(0, 5) : [];
    const randomAnime = trendingAnimes[0];
    const backgroundPoster = randomAnime?.poster || "https://picsum.photos/seed/anime-background/1200/400";


    return (
        <div className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center -mt-16">
            <div className="absolute inset-0">
                <Image
                    src={backgroundPoster}
                    alt="Anime collage"
                    fill
                    className="object-cover opacity-20 blur-sm"
                    data-ai-hint="anime background"
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
                {trendingAnimes.length > 0 && (
                    <>
                        <div className="text-muted-foreground text-sm mb-4 flex items-center justify-center gap-2 flex-wrap">
                            <span className='text-foreground font-semibold'>Trending:</span>
                            {trendingAnimes.map((anime, index) => (
                                <Link key={anime.id} href={`/anime/${anime.id}`} className="hover:text-primary transition-colors">
                                  {anime.name}
                                  {index < trendingAnimes.length - 1 && ','}
                                </Link>
                            ))}
                        </div>
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

const AnimeSection = ({ title, animes, viewMoreLink }: { title: string, animes: AnimeBase[], viewMoreLink?: string }) => {
    if (!animes || animes.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">{title}</h2>
                {viewMoreLink && (
                    <Button variant="link" asChild>
                        <Link href={viewMoreLink} className="flex items-center gap-1">
                            View More <ArrowRight className="w-4 h-4"/>
                        </Link>
                    </Button>
                )}
            </div>
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                 <div className="flex space-x-4 pb-4">
                    {animes.slice(0, 10).map((anime) => (
                         <div key={anime.id} className="w-40 sm:w-44">
                             <AnimeCard anime={anime} />
                         </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
    );
};


export default function MainDashboardPage() {
  const { data: homeDataResult, isLoading } = useQuery<{data: HomeData} | { success: false; error: string }>({
      queryKey: ['homeData'],
      queryFn: AnimeService.getHomeData,
  });

  const homeData = homeDataResult && !('success' in homeDataResult) ? homeDataResult.data : null;

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <SpotlightSection />
      
      <main className="px-4 sm:px-6 lg:px-8 mt-12 mb-12 space-y-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : homeData ? (
          <>
            <AnimeSection title="Trending" animes={homeData.trendingAnimes} viewMoreLink="/category/trending" />
            <AnimeSection title="Latest Episodes" animes={homeData.latestEpisodeAnimes} viewMoreLink="/category/recently-updated" />
            <AnimeSection title="Top Upcoming" animes={homeData.topUpcomingAnimes} viewMoreLink="/category/upcoming" />
            <AnimeSection title="Most Popular" animes={homeData.mostPopularAnimes} viewMoreLink="/category/popular" />
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">Could not load anime data</h3>
            <p className="text-muted-foreground">Please try refreshing the page.</p>
          </div>
        )}
      </main>
    </div>
  );
}
