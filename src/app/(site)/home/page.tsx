
'use client';
import { AnimeBase, SpotlightAnime, HomeData, ScheduleResponse, Top10Anime } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, PlayCircle, Clapperboard, Tv, Play, TrendingUp, Heart, Calendar, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimeCard } from '@/components/AnimeCard';
import { Bookmark } from 'lucide-react';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { AnimeSection } from '@/components/home/AnimeSection';
import { AnimeService } from '@/lib/AnimeService';

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
    <div className="relative w-full h-[60vh] md:h-[80vh] group -mt-16">
        <div className="absolute inset-0">
            {spotlights.map((s, index) => (
                <Image
                    key={s.id}
                    src={s.poster}
                    alt={s.name}
                    fill
                    sizes="100vw"
                    className={cn(
                        'object-cover transition-opacity duration-1000',
                        index === currentIndex ? 'opacity-30' : 'opacity-0'
                    )}
                    priority
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end items-start text-left pb-16 md:pb-24">
           <div key={currentIndex} className="animate-banner-fade-in w-full">
              <span className="text-primary font-bold text-sm md:text-base">#{spotlight.rank} Spotlight</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold my-3 text-glow max-w-2xl line-clamp-2">{spotlight.name}</h1>
              <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground mb-4 flex-wrap">
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
    <div className="bg-card/50 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/50">
        <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <div>
                <h3 className="font-bold">💖 Love this site?</h3>
                <p className="text-xs text-muted-foreground">Share it with others to let them know!</p>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-muted/50 hover:border-primary/50 border-2 border-transparent">💖 40k</button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-muted/50 hover:border-primary/50 border-2 border-transparent">🤯 4.4k</button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-muted/50 hover:border-primary/50 border-2 border-transparent">😢 6.5k</button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm transition-all duration-200 bg-muted/50 hover:border-primary/50 border-2 border-transparent">😂 5.8k</button>
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
            <div className="bg-card/50 p-2 rounded-lg border border-border/50">
                <div className="space-y-2">
                    {animes.slice(0, 7).map((anime, index) => (
                        <Link href={`/anime/${anime.id}`} key={`${anime.id}-${index}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group">
                            <div className="relative w-12 h-[72px] flex-shrink-0">
                                <Image src={anime.poster} alt={anime.name} fill sizes="48px" className="object-cover rounded-md" />
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

    const { data: scheduleData, isLoading, error, refetch } = useQuery<ScheduleResponse>({
        queryKey: ['schedule', selectedDate.toISOString().split('T')[0]],
        queryFn: () => AnimeService.getSchedule(selectedDate.toISOString().split('T')[0]),
    });

    const handleDateChange = (days: number) => {
        setSelectedDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        });
    }

    const scheduledAnimes = scheduleData?.scheduledAnimes;
    
    return (
        <section className='bg-card/50 p-4 rounded-lg border border-border/50'>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">Schedule 🗓️</h2>
            </div>
            <div className="flex justify-between items-center bg-card p-1 rounded-lg mb-4 flex-wrap">
                <button onClick={() => handleDateChange(-1)} className="p-2 rounded-md hover:bg-muted">
                    <ChevronLeft className="w-5 h-5"/>
                </button>
                <div className="text-center text-sm font-semibold">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <button onClick={() => handleDateChange(1)} className="p-2 rounded-md hover:bg-muted">
                    <ChevronRight className="w-5 h-5"/>
                </button>
            </div>
            <div className="space-y-1 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                     <ErrorDisplay description='Could not load schedule.' onRetry={refetch} isCompact/>
                ) : scheduledAnimes && scheduledAnimes.length > 0 ? scheduledAnimes.map((anime: any) => {
                    return (
                        <Link key={anime.id} href={`/anime/${anime.id}`} className="flex justify-between items-center group p-2 rounded-md hover:bg-muted/50 border-b border-border/50 last:border-b-0">
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


const TrendingSidebar = ({ top10Animes }: { top10Animes: HomeData['top10Animes'] | undefined }) => {
    const [trendingPeriod, setTrendingPeriod] = useState<'today' | 'week' | 'month'>('today');
    if (!top10Animes) return null;

    const animesToDisplay = top10Animes[trendingPeriod] || [];

    return (
        <div className='bg-card/50 p-4 rounded-lg border border-border/50'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-bold flex items-center gap-2">Top 10 🏆</h2>
                <div className="flex items-center text-sm bg-card p-1 rounded-md gap-1">
                    <button onClick={() => setTrendingPeriod('today')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'today' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Today</button>
                    <button onClick={() => setTrendingPeriod('week')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'week' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Week</button>
                    <button onClick={() => setTrendingPeriod('month')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'month' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Month</button>
                </div>
            </div>
          <div className='space-y-1'>
            {animesToDisplay.map((anime: Top10Anime, index) => (
              <Link key={anime.id} href={`/anime/${anime.id}`} className="block p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4 group">
                  <span className={`text-2xl font-bold w-8 text-center flex-shrink-0 ${(index + 1) < 4 ? 'text-primary text-glow-sm' : 'text-muted-foreground'}`}>{String(anime.rank || index + 1).padStart(2, '0')}</span>
                  <div className="relative w-14 h-20 flex-shrink-0">
                     <Image src={anime.poster} alt={anime.name} fill sizes="56px" className="rounded-md object-cover" />
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
  const { data, isLoading, error, refetch } = useQuery<HomeData>({
    queryKey: ['homeData'],
    queryFn: AnimeService.home,
  });
  
  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>;
  if (error || !data) {
    return <ErrorDisplay onRetry={refetch} />;
  }
  
  const { spotlightAnimes, top10Animes, topAiringAnimes, topUpcomingAnimes, latestCompletedAnimes, trendingAnimes, latestEpisodeAnimes, mostPopularAnimes, mostFavoriteAnimes } = data;


  return (
    <div className="min-h-screen bg-background text-foreground">
      <SpotlightSection spotlights={spotlightAnimes} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-[-4rem] md:mt-[-6rem] space-y-8">
        <PollSection />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-12 xl:col-span-9 space-y-12">
                <AnimeSection title="Trending" animes={trendingAnimes} category="trending" />
                <AnimeSection title="Latest Episodes" animes={latestEpisodeAnimes} category="latest-episodes" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <SmallListSection title="Top Airing" animes={topAiringAnimes} />
                    <SmallListSection title="Top Upcoming" animes={topUpcomingAnimes} />
                    <SmallListSection title="Completed" animes={latestCompletedAnimes} />
                </div>
                <AnimeSection title="Most Popular" animes={mostPopularAnimes} category="most-popular" />
                <AnimeSection title="Most Favorite" animes={mostFavoriteAnimes} category="most-favorite" />
            </div>
            <div className="md:col-span-12 xl:col-span-3 space-y-8">
                <TrendingSidebar top10Animes={top10Animes} />
                <ScheduleSidebar />
            </div>
        </div>
      </div>
    </div>
  );
}
