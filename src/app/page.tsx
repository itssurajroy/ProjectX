
'use client';

import { AnimeService } from '@/lib/AnimeService';
import { AnimeBase, SpotlightAnime, HomeData, ScheduleResponse } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Play, Bookmark, Clapperboard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimeCard } from "@/components/AnimeCard";

const SpotlightSection = ({ spotlights }: { spotlights: SpotlightAnime[] | undefined }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    if (!spotlights || spotlights.length === 0) return;
    setCurrentIndex((prev) => (prev === spotlights.length - 1 ? 0 : prev + 1));
  }, [spotlights]);

  const resetAutoplay = useCallback(() => {
    if (autoplayTimeoutRef.current) {
        clearInterval(autoplayTimeoutRef.current);
    }
    autoplayTimeoutRef.current = setInterval(handleNext, 7000);
  },[handleNext]);

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayTimeoutRef.current) {
        clearInterval(autoplayTimeoutRef.current);
      }
    };
  }, [spotlights, resetAutoplay]);

  if (!spotlights || spotlights.length === 0) return null;

  const spotlight = spotlights[currentIndex];
  
  if (!spotlight) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] group">
        <div className="absolute inset-0">
            {spotlights.map((s, index) => (
                <Image
                    key={s.id}
                    src={s.poster}
                    alt={s.name}
                    fill
                    className={cn(
                        'object-cover transition-opacity duration-1000',
                        index === currentIndex ? 'opacity-20' : 'opacity-0'
                    )}
                    priority
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end items-start text-left pb-16 md:pb-24">
           <div key={currentIndex} className="animate-banner-fade-in w-full">
              <span className="text-primary font-bold text-sm md:text-base">#{spotlight.rank} Spotlight</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold my-3 text-glow max-w-2xl line-clamp-2">{spotlight.name}</h1>
              <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground mb-4">
                  {spotlight.otherInfo.map((info, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                       {info}
                    </span>
                  ))}
              </div>
              <p className="max-w-xl text-gray-300 mb-6 line-clamp-3 text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: spotlight.description }}></p>
              
              <div className="flex gap-3 items-center">
                  <Link href={`/watch/${spotlight.id}`} className="bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-lg font-bold text-sm md:text-base flex items-center gap-2 hover:bg-primary/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30">
                      <Play className="w-5 h-5" /> Watch Now
                  </Link>
                  <Link href={`/anime/${spotlight.id}`} className="border border-white/50 text-white px-4 py-3 rounded-lg font-bold text-base flex items-center gap-2 hover:bg-white/10 transition-colors">
                      <Bookmark className="w-5 h-5"/>
                  </Link>
              </div>
            </div>
        </div>
        
         <div className="absolute right-4 md:right-8 bottom-8 z-20 flex items-center gap-3">
            <button onClick={() => {
                setCurrentIndex((prev) => (prev === 0 ? spotlights.length - 1 : prev - 1));
                resetAutoplay();
            }} className="p-2 bg-white/10 rounded-full transition-all hover:bg-white/20 hover:scale-110">
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6"/>
            </button>
            <span className='font-semibold text-sm md:text-base'>{currentIndex + 1}/{spotlights.length}</span>
            <button onClick={() => {
                handleNext();
                resetAutoplay();
            }} className="p-2 bg-white/10 rounded-full transition-all hover:bg-white/20 hover:scale-110">
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6"/>
            </button>
        </div>
    </div>
  );
};

const PollSection = () => (
    <div className="bg-card p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/50">
        <div className="flex items-center gap-3">
            
            <div>
                <h3 className="font-bold">Love this site?</h3>
                <p className="text-xs text-muted-foreground">Share it with others to let them know!</p>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-muted hover:border-primary/50 border-2 border-transparent">💖 40k</button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-muted hover:border-primary/50 border-2 border-transparent">🤯 4.4k</button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-muted hover:border-primary/50 border-2 border-transparent">😢 6.5k</button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-muted hover:border-primary/50 border-2 border-transparent">😂 5.8k</button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-red-500/20 text-red-300 hover:border-red-500/50 border-2 border-transparent">😠 18.3k</button>
        </div>
    </div>
)

const SmallListSection = ({ title, animes }: { title: string, animes: AnimeBase[] | undefined }) => {
    if (!animes || animes.length === 0) return null;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <div className="bg-card p-2 rounded-lg border border-border/50">
                <div className="space-y-2">
                    {animes.slice(0, 7).map((anime, index) => (
                        <Link href={`/anime/${anime.id}`} key={`${anime.id}-${index}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors group">
                            <div className="relative w-12 h-[72px] flex-shrink-0">
                                <Image src={anime.poster} alt={anime.name} fill className="object-cover rounded-md" />
                            </div>
                            <div className='overflow-hidden'>
                                <p className='font-semibold text-sm group-hover:text-primary line-clamp-2'>{anime.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    {anime.type && <span>{anime.type}</span>}
                                    {anime.episodes?.sub && <span className="flex items-center gap-1"><Clapperboard className="w-3 h-3"/> {anime.episodes.sub}</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}


const ScheduleSidebar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { data: scheduleResult, isLoading } = useQuery<{ data: ScheduleResponse } | { success: false; error: string }>({
        queryKey: ['schedule', selectedDate.toISOString().split('T')[0]],
        queryFn: () => AnimeService.getSchedule(selectedDate.toISOString().split('T')[0]),
    });

    const days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(new Date().getDate() - 3 + i);
        return date;
    });

    const scheduledAnimes = scheduleResult && !('success' in scheduleResult) && scheduleResult.data ? scheduleResult.data.scheduledAnimes : [];
    
    return (
        <section className='bg-card p-4 rounded-lg border border-border/50'>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">Schedule</h2>
            </div>
            <div className="flex justify-between items-center bg-muted/50 p-1 rounded-lg mb-4 flex-wrap">
                {days.map(day => (
                    <button key={day.toISOString()} onClick={() => setSelectedDate(day)} className={cn("text-center text-xs p-2 rounded-md flex-1 min-w-[40px] transition-colors", day.toDateString() === selectedDate.toDateString() ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                        <p className="font-bold">{day.toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}</p>
                        <p>{day.getDate()}</p>
                    </button>
                ))}
            </div>
            <div className="space-y-1 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : scheduledAnimes && scheduledAnimes.length > 0 ? scheduledAnimes.map((anime: any) => {
                    return (
                        <Link key={anime.id} href={`/anime/${anime.id}`} className="flex justify-between items-center group p-2 rounded-md hover:bg-muted border-b border-border/50 last:border-b-0">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="text-sm font-bold text-primary w-10 text-center">{anime.time}</span>
                                <p className="truncate font-semibold text-sm group-hover:text-primary transition-colors">{anime.name}</p>
                            </div>
                            <span className='text-xs text-muted-foreground'>EP {anime.episode || '?'}</span>
                        </Link>
                    )
                }) : (
                    <p className="text-sm text-center text-muted-foreground py-8">No schedule for this day. 😴</p>
                )}
            </div>
        </section>
    );
};


const TrendingSidebar = ({ trendingAnimes }: { trendingAnimes: AnimeBase[] | undefined }) => {
    const [trendingPeriod, setTrendingPeriod] = useState<'today' | 'week' | 'month'>('today');
    if (!trendingAnimes) return null;

    // Just use the same list for all periods for now
    const animesToDisplay = trendingAnimes;

    return (
        <div className='bg-card p-4 rounded-lg border border-border/50'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-bold flex items-center gap-2">Top Trending</h2>
                <div className="flex items-center text-sm bg-muted/50 p-1 rounded-md">
                    <button onClick={() => setTrendingPeriod('today')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'today' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Today</button>
                    <button onClick={() => setTrendingPeriod('week')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'week' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Week</button>
                    <button onClick={() => setTrendingPeriod('month')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'month' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Month</button>
                </div>
            </div>
          <div className='space-y-1'>
            {animesToDisplay.slice(0, 10).map((anime: any, index) => (
              <Link key={anime.id} href={`/anime/${anime.id}`} className="block p-1.5 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-start gap-4 group">
                  <span className={`text-2xl font-bold w-8 text-center flex-shrink-0 ${(index + 1) < 4 ? 'text-primary text-glow-sm' : 'text-muted-foreground'}`}>{String(anime.rank || index + 1).padStart(2, '0')}</span>
                  <div className="relative w-14 h-20 flex-shrink-0">
                     <Image src={anime.poster} alt={anime.name} fill className="rounded-md object-cover" />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{anime.name}</p>
                     <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                       {anime.episodes?.sub && <span className="px-1.5 py-0.5 rounded-sm bg-muted/80">SUB {anime.episodes.sub}</span>}
                       {anime.episodes?.dub && <span className="px-1.5 py-0.5 rounded-sm bg-blue-500/50 text-blue-300">DUB {anime.episodes.dub}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
    );
};


export default function MainDashboardPage() {
  const { data: apiResponse, isLoading, error } = useQuery<{data: HomeData} | { success: false; error: string }>({
    queryKey: ['homeData'],
    queryFn: AnimeService.getHomeData,
  });

  const [filter, setFilter] = useState<'all' | 'sub' | 'dub'>('all');
  
  useEffect(() => {
    if (error) {
      console.error('Error fetching home data:', error);
    }
  }, [error]);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  if (error || !apiResponse || (apiResponse && 'success' in apiResponse && !apiResponse.success) || !('data' in apiResponse) || !apiResponse.data) {
    return <div className="flex justify-center items-center h-screen">Could not load home data.</div>;
  }
  
  const data = apiResponse.data;
  const { spotlightAnimes, trendingAnimes, latestEpisodeAnimes, topAiringAnimes, topUpcomingAnimes, latestCompletedAnimes } = data;

  const filteredLatest = latestEpisodeAnimes?.filter(anime => {
    if (filter === 'sub') return !!anime.episodes?.sub;
    if (filter === 'dub') return !!anime.episodes?.dub;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SpotlightSection spotlights={spotlightAnimes} />
      
      <main className="px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 xl:col-span-9 space-y-12">
                <section>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                        <h2 className="text-xl md:text-2xl font-bold">Latest Updates 🚀</h2>
                         <div className='flex items-center gap-2'>
                            <button onClick={() => setFilter('all')} className={cn('px-3 py-1 text-sm rounded-md', filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}>All</button>
                            <button onClick={() => setFilter('sub')} className={cn('px-3 py-1 text-sm rounded-md', filter === 'sub' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}>Sub</button>
                            <button onClick={() => setFilter('dub')} className={cn('px-3 py-1 text-sm rounded-md', filter === 'dub' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}>Dub</button>
                         </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-6">
                        {filteredLatest?.slice(0, 10).map((anime) => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                </section>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SmallListSection title="Top Airing 🔥" animes={topAiringAnimes} />
                    <SmallListSection title="Top Upcoming ✨" animes={topUpcomingAnimes} />
                    <SmallListSection title="Latest Completed ✅" animes={latestCompletedAnimes} />
                </div>
            </div>
            <div className="lg:col-span-12 xl:col-span-3 space-y-8">
                <TrendingSidebar trendingAnimes={trendingAnimes} />
                <ScheduleSidebar />
            </div>
        </div>
      </main>
    </div>
  );
}
