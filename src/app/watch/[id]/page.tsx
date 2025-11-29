
'use client';

import { useEffect, useMemo, Suspense, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Menu } from 'lucide-react';
import { AnimeService, extractEpisodeNumber } from '@/lib/AnimeService';
import EpisodeList from '@/components/watch/episode-list';
import { AnimeEpisode, AnimeAboutResponse, EpisodeSourcesResponse } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import PlayerOverlayControls from '@/components/watch/PlayerOverlayControls';
import ServerToggle from '@/components/watch/ServerToggle';
import LanguageToggle from '@/components/watch/LanguageToggle';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Breadcrumb from '@/components/common/Breadcrumb';
import { AnimeCard } from '@/components/AnimeCard';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import WatchSidebar from '@/components/watch/WatchSidebar';

function WatchPageComponent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const animeId = params.id as string;
  const episodeParam = searchParams.get('ep');

  const { data: aboutResponse, isLoading: isLoadingAbout, error: aboutError, refetch: refetchAbout } = useQuery<{data: AnimeAboutResponse} | { success: false; error: string }>({
    queryKey: ['anime', animeId],
    queryFn: () => AnimeService.getAnimeAbout(animeId),
    enabled: !!animeId,
  });

  const { data: episodesResponse, isLoading: isLoadingEpisodes, error: episodesError, refetch: refetchEpisodes } = useQuery({
    queryKey: ["anime-episodes", animeId],
    queryFn: () => AnimeService.getEpisodes(animeId),
    enabled: !!animeId,
  });

  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
  
  const episodes: AnimeEpisode[] = useMemo(() => episodesResponse && 'data' in episodesResponse ? episodesResponse.data.episodes : [], [episodesResponse]);
  const about = useMemo(() => aboutResponse && 'data' in aboutResponse ? aboutResponse.data.anime : null, [aboutResponse]);
  const recommendedAnimes = useMemo(() => aboutResponse && 'data' in aboutResponse ? aboutResponse.data.recommendedAnimes : [], [aboutResponse]);
  const mostPopularAnimes = useMemo(() => aboutResponse && 'data' in aboutResponse ? aboutResponse.data.mostPopularAnimes : [], [aboutResponse]);
  
  const currentEpisode = useMemo(() => {
    if (!episodes || episodes.length === 0) return null;
    const epNum = episodeParam || '1';
    return episodes.find(e => {
        const extractedEp = extractEpisodeNumber(e.episodeId);
        return extractedEp === epNum || String(e.number) === epNum;
    }) || episodes[0];
  }, [episodes, episodeParam]);

   const { data: sourcesResponse, isLoading: isLoadingSources, error: sourcesError } = useQuery<{data: EpisodeSourcesResponse} | { success: false, error: string }>({
      queryKey: ["episode-sources", currentEpisode?.episodeId, language],
      queryFn: () => AnimeService.getEpisodeSources(currentEpisode!.episodeId, language),
      enabled: !!currentEpisode,
  });
  
  useEffect(() => {
    if (isLoadingEpisodes || !episodes) return;
    
    if (episodes.length > 0 && !episodeParam) {
      const targetEpId = extractEpisodeNumber(episodes[0].episodeId) || episodes[0].number;
      if (targetEpId) {
        router.replace(`/watch/${animeId}?ep=${targetEpId}`);
      }
    }
  }, [animeId, router, episodeParam, episodes, isLoadingEpisodes]);

  
  const navigateEpisode = (dir: 'next' | 'prev') => {
    if (!episodes.length || !currentEpisode) return;
    const currentIndex = episodes.findIndex((ep) => ep.episodeId === currentEpisode.episodeId);
    if (currentIndex === -1) return;
    const newIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= episodes.length) return;
    const nextEpId = extractEpisodeNumber(episodes[newIndex].episodeId) || episodes[newIndex].number;
    router.push(`/watch/${animeId}?ep=${nextEpId}`);
  };

  const iframeSrc = sourcesResponse && 'data' in sourcesResponse ? sourcesResponse.data.url : undefined;
  
  if (isLoadingAbout || isLoadingEpisodes) {
     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>;
  }

  if (aboutError || episodesError || !about || episodes.length === 0) {
    const refetch = () => {
        if (aboutError) refetchAbout();
        if (episodesError) refetchEpisodes();
    }
    return (
      <ErrorDisplay 
        title="Content Not Available"
        description="We couldn't load the details for this anime or its episodes. Please try again later or go back home."
        onRetry={refetch}
      />
    );
  }

  const currentIndex = episodes.findIndex((ep) => ep.episodeId === currentEpisode?.episodeId);

  return (
     <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-8 pt-24 space-y-6">
        <Breadcrumb items={[
            { label: 'Home', href: '/home' },
            { label: about.info.stats.type, href: `/search?type=${about.info.stats.type}` },
            { label: about.info.name, href: `/anime/${animeId}` },
            { label: `Episode ${currentEpisode?.number}` }
        ]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Menu className="w-4 h-4 mr-2" /> Show Episode List
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0">
                  <SheetHeader className="p-3 border-b">
                     <h2 className="text-lg font-bold">Episodes</h2>
                  </SheetHeader>
                  <SheetClose asChild>
                    <EpisodeList 
                        episodes={episodes} 
                        currentEpisodeId={currentEpisode?.number.toString() || null} 
                        onEpisodeSelect={(ep) => router.push(`/watch/${animeId}?ep=${extractEpisodeNumber(ep.episodeId) || ep.number}`)}
                    />
                  </SheetClose>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden lg:block lg:col-span-3">
                 <EpisodeList 
                    episodes={episodes} 
                    currentEpisodeId={currentEpisode?.number.toString() || null} 
                    onEpisodeSelect={(ep) => router.push(`/watch/${animeId}?ep=${extractEpisodeNumber(ep.episodeId) || ep.number}`)}
                />
            </div>
            <div className="lg:col-span-9 space-y-6">
                 <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                   {(isLoadingSources || !iframeSrc) ? (
                        <div className="flex flex-col justify-center items-center h-full text-center">
                            {sourcesError ? (
                                <ErrorDisplay isCompact onRetry={() => {}} description="Could not load video sources." />
                            ) : (
                                <Loader2 className="animate-spin text-primary w-12 h-12" />
                            )}
                        </div>
                    ) : (
                        <iframe
                            key={iframeSrc}
                            src={iframeSrc}
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    )}
                </div>
                
                <PlayerOverlayControls 
                  onPrev={() => navigateEpisode('prev')}
                  onNext={() => navigateEpisode('next')}
                  isPrevDisabled={currentIndex <= 0}
                  isNextDisabled={currentIndex >= episodes.length - 1}
                />

                <div className="bg-card p-3 border border-border/50 rounded-lg flex flex-col md:flex-row gap-4 justify-between">
                  <div className="space-y-1">
                    <h2 className="font-semibold text-lg">You are watching Episode {currentEpisode?.number}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-1">{currentEpisode?.title || 'No title available'}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <LanguageToggle onLanguageChange={(lang) => setLanguage(lang)} />
                    <ServerToggle onServerChange={(server) => console.log(server)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  <div className="xl:col-span-8 space-y-6">
                    {/* Comments section can be added back here if needed */}
                  </div>
                  <div className="xl:col-span-4">
                    {about && <WatchSidebar animeInfo={about.info} animeId={animeId} episodeId={currentEpisode?.episodeId || null} mostPopular={mostPopularAnimes}/>}
                  </div>
                </div>
            </div>
        </div>

        {recommendedAnimes && recommendedAnimes.length > 0 && (
          <section className="pt-8">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3">Recommended for you</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
              {recommendedAnimes.slice(0, 6).map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>
        )}
     </main>
  );
}


export default function WatchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>}>
            <WatchPageComponent />
        </Suspense>
    )
}
