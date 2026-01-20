
'use client';
import { AnimeBase, SpotlightAnime, HomeData, ScheduleResponse, Top10Anime, QtipAnime, AnimeAboutResponse } from '@/lib/types/anime';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, PlayCircle, Clapperboard, Tv, Play, TrendingUp, Heart, Calendar, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AnimeCard } from '@/components/AnimeCard';
import { Bookmark } from 'lucide-react';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { AnimeSection } from '@/components/home/AnimeSection';
import { AnimeService } from '@/lib/services/AnimeService';
import ProgressiveImage from '@/components/ProgressiveImage';
import { motion, AnimatePresence } from 'framer-motion';
import Balancer from 'react-wrap-balancer';
import { Button } from '@/components/ui/button';
import EpisodeCountdown from '@/components/watch/EpisodeCountdown';
import { useTitleLanguageStore } from '@/store/title-language-store';
import { useDoc } from '@/firebase';

interface HomepageSettings {
    spotlightAnimeIds?: string[];
    featuredSections?: { id: string; title: string; enabled: boolean; }[];
}


const SpotlightSection = ({ spotlights }: { spotlights: SpotlightAnime[] | undefined }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { language } = useTitleLanguageStore();

  // Reset index when the spotlight data changes. This prevents out-of-bounds errors
  // if the new list is shorter than the old one.
  useEffect(() => {
    setCurrentIndex(0);
  }, [spotlights]);

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

  // A defensive check to ensure currentIndex is valid before rendering
  if (currentIndex >= spotlights.length) {
    return null; 
  }

  const spotlight = spotlights[currentIndex];
  
  if (!spotlight) return null;

  const title = language === 'romaji' && spotlight.jname ? spotlight.jname : spotlight.name;

  return (
    <div className="relative w-full h-[60vh] md:h-[85vh] group overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={spotlight.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <ProgressiveImage
            src={spotlight.poster}
            alt={spotlight.name || "Spotlight Banner"}
            fill
            className={'object-cover'}
            priority
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end items-start text-left pb-16 md:pb-24">
        <motion.div 
          key={`${spotlight.id}-content`}
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <span className="text-primary font-bold text-sm md:text-base">#{spotlight.rank} Spotlight</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display my-3 text-glow">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground mb-4 flex-wrap">
              {spotlight.otherInfo.map((info, i) => (
                <span key={i} className="flex items-center gap-1.5">
                   {info}
                </span>
              ))}
          </div>
          <p className="max-w-xl text-gray-300 mb-6 line-clamp-3 text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: spotlight.description }}></p>
          
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Button asChild size="lg" className="shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform w-full sm:w-auto">
                  <Link href={`/watch/${spotlight.id}`} className="flex items-center gap-2">
                      <Play className="w-5 h-5" /> Watch Now
                  </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="transform hover:scale-105 transition-transform bg-white/10 hover:bg-white/20 w-full sm:w-auto">
                   <Link href={`/anime/${spotlight.id}`} className="flex items-center gap-2">
                      <Info className="w-5 h-5" /> Details
                  </Link>
              </Button>
          </div>
          <div className="mt-4">
             <EpisodeCountdown airingTime={spotlight.nextAiringEpisode?.airingTime} />
          </div>
        </motion.div>
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
    <div className="bg-card/50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/50">
        <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <div>
                <h3 className="font-bold font-display text-lg">💖 Love this site?</h3>
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
    const { language } = useTitleLanguageStore();
    if (!animes || animes.length === 0) return null;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-display">{title}</h2>
            </div>
            <div className="bg-card p-2 rounded-lg border border-border">
                <div className="space-y-2">
                    {animes.slice(0, 7).map((anime, index) => {
                        const animeTitle = language === 'romaji' && anime.jname ? anime.jname : anime.name;
                        return (
                            <Link href={`/anime/${anime.id}`} key={`${anime.id}-${index}`} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted transition-colors group">
                                <div className="relative w-12 h-[72px] flex-shrink-0">
                                    <ProgressiveImage 
                                      src={anime.poster}
                                      alt={anime.name || "Anime Poster"} 
                                      fill 
                                      className="object-cover rounded-md" 
                                    />
                                </div>
                                <div className='overflow-hidden flex-1'>
                                    <p className='font-semibold text-sm group-hover:text-primary line-clamp-2'>{animeTitle}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        {anime.type && <span>{anime.type}</span>}
                                        {anime.duration && <span>&bull; {anime.duration}</span>}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


const ScheduleSidebar = ({ topAiringAnimes }: { topAiringAnimes: AnimeBase[] | undefined }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { language } = useTitleLanguageStore();

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

    const topAiringIds = new Set((topAiringAnimes || []).map(a => a.id));
    const scheduledAnimes = scheduleData?.scheduledAnimes || [];
    
    return (
        <section className='bg-card p-4 rounded-lg border border-border'>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold font-display flex items-center gap-2">🗓️ Schedule</h2>
            </div>
            <div className="flex justify-between items-center bg-background p-1 rounded-lg mb-4 flex-wrap">
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
                    const isTopAiring = topAiringIds.has(anime.id);
                    const animeTitle = language === 'romaji' && anime.jname ? anime.jname : anime.name;
                    return (
                        <Link key={anime.id} href={`/anime/${anime.id}`} className={cn(
                            "flex justify-between items-center group p-2 rounded-md hover:bg-muted/50 border-b border-border/50 last:border-b-0",
                             isTopAiring && "bg-primary/10 hover:bg-primary/20"
                        )}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className={cn(
                                    "text-sm font-bold w-10 text-center",
                                    isTopAiring ? "text-primary" : "text-muted-foreground"
                                )}>{anime.time}</span>
                                <p className={cn(
                                    "truncate font-semibold text-sm group-hover:text-primary transition-colors",
                                     isTopAiring && "text-primary"
                                )}>{animeTitle}</p>
                            </div>
                            <span className='text-xs text-muted-foreground'>EP {anime.episode || '?'}</span>
                        </Link>
                    )
                }) : (
                    <p className="text-sm text-center text-muted-foreground py-8">No releases scheduled today. 😴</p>
                )}
            </div>
        </section>
    );
};


const TrendingSidebar = ({ top10Animes }: { top10Animes: HomeData['top10Animes'] | undefined }) => {
    const [trendingPeriod, setTrendingPeriod] = useState<'today' | 'week' | 'month'>('today');
    const { language } = useTitleLanguageStore();
    if (!top10Animes) return null;

    const animesToDisplay = top10Animes[trendingPeriod] || [];

    return (
        <div className='bg-card p-4 rounded-lg border border-border'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-bold font-display flex items-center gap-2">🏆 Top 10</h2>
                <div className="flex items-center text-sm bg-background p-1 rounded-md gap-1">
                    <button onClick={() => setTrendingPeriod('today')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'today' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Today</button>
                    <button onClick={() => setTrendingPeriod('week')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'week' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Week</button>
                    <button onClick={() => setTrendingPeriod('month')} className={cn("px-3 py-1 text-xs rounded-md", trendingPeriod === 'month' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>Month</button>
                </div>
            </div>
            <div className="space-y-2">
            {animesToDisplay.map((anime, index) => {
                const animeTitle = language === 'romaji' && anime.jname ? anime.jname : anime.name;
                return (
                    <Link
                        key={anime.id}
                        href={`/anime/${anime.id}`}
                        className="relative block p-3 rounded-lg overflow-hidden group hover:bg-muted transition-colors"
                    >
                        <ProgressiveImage
                            src={anime.poster}
                            alt={anime.name || "Anime Poster"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent"></div>
                        
                        <div className="relative flex items-center gap-3">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-lg"
                                style={{ borderColor: index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--border))'}}>
                                {anime.rank || index + 1}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{animeTitle}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    {anime.episodes?.sub && <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary"><Clapperboard className="w-3 h-3"/> {anime.episodes.sub}</span>}
                                    {anime.episodes?.dub && <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-green-500/20 text-green-300">DUB {anime.episodes.dub}</span>}
                                    <span className='hidden sm:inline'>{anime.type}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            })}
            </div>
        </div>
    );
};


export default function HomePage() {
  const { data: homeData, isLoading: isLoadingHome, error, refetch } = useQuery<HomeData>({
    queryKey: ['homeData'],
    queryFn: AnimeService.home,
  });

  const { data: homepageSettings, isLoading: isLoadingSettings } = useDoc<HomepageSettings>('settings/homepage');

  const { data: customSpotlights, isLoading: isLoadingCustomSpotlights } = useQuery({
      queryKey: ['customSpotlights', homepageSettings?.spotlightAnimeIds],
      queryFn: async () => {
          if (!homepageSettings?.spotlightAnimeIds) return null;

          const animeDetailsPromises = homepageSettings.spotlightAnimeIds.map(id => 
              AnimeService.anime(id).catch(() => null)
          );
          const results = await Promise.all(animeDetailsPromises);
          
          const detailedAnimes = results
              .filter((res): res is AnimeAboutResponse => res !== null && !!res.anime?.info)
              .map((res, index) => {
                  const info = res.anime.info;
                  const moreInfo = res.anime.moreInfo;
                  
                  const otherInfo = [];
                  if (info.stats.type) otherInfo.push(info.stats.type);
                  if (info.stats.duration) otherInfo.push(info.stats.duration);
                  if (info.stats.rating && info.stats.rating !== 'N/A') otherInfo.push(info.stats.rating);
                  if (info.stats.quality) otherInfo.push(info.stats.quality);

                  return {
                      id: info.id,
                      name: info.name,
                      jname: moreInfo.japanese,
                      poster: info.poster,
                      description: info.description,
                      rank: index + 1,
                      otherInfo,
                      nextAiringEpisode: moreInfo.nextAiringEpisode,
                  } as SpotlightAnime;
              });
          return detailedAnimes;
      },
      enabled: !!homepageSettings?.spotlightAnimeIds,
      staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const spotlightAnimes = useMemo(() => {
    const apiSpotlights = homeData?.spotlightAnimes || [];
    const manualSpotlights = customSpotlights || [];

    const apiSpotlightIds = new Set(apiSpotlights.map(anime => anime.id));
    const uniqueManualSpotlights = manualSpotlights.filter(anime => !apiSpotlightIds.has(anime.id));

    return [...apiSpotlights, ...uniqueManualSpotlights];
  }, [homeData?.spotlightAnimes, customSpotlights]);

  const allSections = useMemo(() => {
    if (!homeData) return [];
    return [
        { id: 'trending', title: 'Trending', category: 'trending', isSpecial: 'trending', animes: homeData.trendingAnimes, component: AnimeSection },
        { id: 'latest-episodes', title: 'Latest Episodes', category: 'latest-episodes', animes: homeData.latestEpisodeAnimes, component: AnimeSection },
        { id: 'top-upcoming', title: 'Top Upcoming', category: 'top-upcoming', animes: homeData.topUpcomingAnimes, component: AnimeSection },
        { id: 'top-airing', title: 'Top Airing', animes: homeData.topAiringAnimes, component: SmallListSection },
        { id: 'completed-series', title: 'Completed Series', animes: homeData.latestCompletedAnimes, component: SmallListSection },
        { id: 'most-popular', title: 'Most Popular', category: 'most-popular', animes: homeData.mostPopularAnimes, component: AnimeSection },
        { id: 'most-favorite', title: 'Most Favorite', category: 'most-favorite', animes: homeData.mostFavoriteAnimes, component: AnimeSection },
    ];
  }, [homeData]);

  const orderedSections = useMemo(() => {
    if (homepageSettings?.featuredSections) {
        return homepageSettings.featuredSections
            .filter(s => s.enabled)
            .map(s => {
                const sectionData = allSections.find(as => as.id === s.id);
                return sectionData ? { ...sectionData, title: s.title } : null;
            })
            .filter((s): s is typeof allSections[0] => !!s);
    }
    return allSections;
  }, [homepageSettings, allSections]);

  const isLoading = isLoadingHome || isLoadingSettings || (!!homepageSettings && isLoadingCustomSpotlights);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>;
  if (error || !homeData) {
    return <ErrorDisplay onRetry={refetch} />;
  }
  
  const { top10Animes, topAiringAnimes } = homeData;

  const smallSectionIds = ['top-airing', 'completed-series'];
  const mainSections = orderedSections.filter(s => !smallSectionIds.includes(s.id));
  const smallSections = orderedSections.filter(s => smallSectionIds.includes(s.id));


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <SpotlightSection spotlights={spotlightAnimes} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="mt-[-4rem] relative z-10">
          <PollSection />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-12 xl:col-span-9 space-y-12">
                {mainSections.map((section) => (
                    <section.component 
                        key={section.id} 
                        title={section.title} 
                        animes={section.animes} 
                        {...(section.component === AnimeSection && { category: section.id, isSpecial: section.isSpecial })} 
                    />
                ))}
                
                {smallSections.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {smallSections.map(section => (
                            <section.component 
                                key={section.id}
                                title={section.title}
                                animes={section.animes}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="md:col-span-12 xl:col-span-3 space-y-8">
                <TrendingSidebar top10Animes={top10Animes} />
                <ScheduleSidebar topAiringAnimes={topAiringAnimes} />
            </div>
        </div>
      </div>
    </div>
  );
}
