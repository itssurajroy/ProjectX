
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Menu } from 'lucide-react';
import AnimeService, { extractEpisodeNumber } from '@/lib/AnimeService';
import EpisodeList from '@/components/watch/episode-list';
import { AnimeEpisode, AnimeAboutResponse } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import PlayerOverlayControls from '@/components/watch/PlayerOverlayControls';
import ServerToggle from '@/components/watch/ServerToggle';
import LanguageToggle, { Language } from '@/components/watch/LanguageToggle';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Breadcrumb from '@/components/common/Breadcrumb';
import { AnimeCard } from '@/components/AnimeCard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import WatchSidebar from '@/components/watch/WatchSidebar';
import CommentsSection from '@/components/watch/comments';
import { useSmartPlayer } from '@/hooks/useSmartPlayer';

function WatchPageComponent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const animeId = params.id as string;
  const episodeParam = searchParams.get('ep');

  const [language, setLanguage] = useState<Language>('sub');
  
  const {
    data: aboutResponse,
    isLoading: isLoadingAbout,
    error: aboutError,
    refetch: refetchAbout,
  } = useQuery<{ data: AnimeAboutResponse } | { success: false; error: string }>(
    {
      queryKey: ['anime', animeId],
      queryFn: () => AnimeService.getAnime(animeId),
      enabled: !!animeId,
    }
  );

  const {
    data: episodesResponse,
    isLoading: isLoadingEpisodes,
    error: episodesError,
    refetch: refetchEpisodes,
  } = useQuery({
    queryKey: ['anime-episodes', animeId],
    queryFn: () => AnimeService.getEpisodes(animeId),
    enabled: !!animeId,
  });

  const episodes: AnimeEpisode[] = useMemo(
    () =>
      episodesResponse && episodesResponse.success
        ? episodesResponse.data.episodes
        : [],
    [episodesResponse]
  );
  
  const about = useMemo(
    () =>
      aboutResponse && aboutResponse.success
        ? aboutResponse.data.anime
        : null,
    [aboutResponse]
  );
  const recommendedAnimes = useMemo(
    () =>
      aboutResponse && aboutResponse.success
        ? aboutResponse.data.recommendedAnimes
        : [],
    [aboutResponse]
  );
  const mostPopularAnimes = useMemo(
    () =>
      aboutResponse && aboutResponse.success
        ? aboutResponse.data.mostPopularAnimes
        : [],
    [aboutResponse]
  );

  const currentEpisode = useMemo(() => {
    if (!episodes || episodes.length === 0) return null;
    const epNum = episodeParam || '1';
    return (
      episodes.find((e) => {
        const extractedEp = extractEpisodeNumber(e.episodeId);
        return extractedEp === epNum || String(e.number) === epNum;
      }) || episodes[0]
    );
  }, [episodes, episodeParam]);

  const { sources, loading: isLoadingSources, error: sourcesError, retry } = useSmartPlayer(currentEpisode?.episodeId || '', language);
  
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const {
    data: serversResponse,
  } = useQuery({
    queryKey: ['episode-servers', currentEpisode?.episodeId],
    queryFn: () => AnimeService.getEpisodeServers(currentEpisode!.episodeId),
    enabled: !!currentEpisode,
  });

  const availableServers = useMemo(() => {
    if (!serversResponse || !serversResponse.success) return [];
    return serversResponse.data[language] || [];
  }, [serversResponse, language]);

  useEffect(() => {
    if (availableServers.length > 0 && !selectedServer) {
      setSelectedServer(availableServers[0].serverName);
    }
  }, [availableServers, selectedServer]);

  useEffect(() => {
    if (isLoadingEpisodes || !episodes) return;

    if (episodes.length > 0 && !episodeParam) {
      const targetEpId =
        extractEpisodeNumber(episodes[0].episodeId) || episodes[0].number;
      if (targetEpId) {
        router.replace(`/watch/${animeId}?ep=${targetEpId}`);
      }
    }
  }, [animeId, router, episodeParam, episodes, isLoadingEpisodes]);

  const navigateEpisode = (dir: 'next' | 'prev') => {
    if (!episodes.length || !currentEpisode) return;
    const currentIndex = episodes.findIndex(
      (ep) => ep.episodeId === currentEpisode.episodeId
    );
    if (currentIndex === -1) return;
    const newIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= episodes.length) return;
    const nextEpId =
      extractEpisodeNumber(episodes[newIndex].episodeId) ||
      episodes[newIndex].number;
    router.push(`/watch/${animeId}?ep=${nextEpId}`);
  };

  const iframeSrc = sources.length > 0 ? sources[0].url : '';

  if (isLoadingAbout || isLoadingEpisodes) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (aboutError || episodesError || !about || episodes.length === 0) {
    const refetch = () => {
      if (aboutError) refetchAbout();
      if (episodesError) refetchEpisodes();
    };
    return (
      <ErrorDisplay
        title="Content Not Available"
        description="We couldn't load the details for this anime or its episodes. Please try again later or go back home."
        onRetry={refetch}
      />
    );
  }

  const currentIndex = episodes.findIndex(
    (ep) => ep.episodeId === currentEpisode?.episodeId
  );
  
  return (
    <main className="container mx-auto space-y-6 px-2 py-8 pt-24 sm:px-4 lg:px-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/home' },
          { label: about.info.stats.type, href: `/search?type=${about.info.stats.type}` },
          { label: about.info.name, href: `/anime/${animeId}` },
          { label: `Episode ${currentEpisode?.number}` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Menu className="mr-2 h-4 w-4" /> Show Episode List
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <SheetHeader className="border-b p-3">
                <h2 className="text-lg font-bold">Episodes</h2>
              </SheetHeader>
              <SheetClose asChild>
                <EpisodeList
                  episodes={episodes}
                  currentEpisodeId={currentEpisode?.number.toString() || null}
                  onEpisodeSelect={(ep) =>
                    router.push(
                      `/watch/${animeId}?ep=${
                        extractEpisodeNumber(ep.episodeId) || ep.number
                      }`
                    )
                  }
                />
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:col-span-3 lg:block">
          <EpisodeList
            episodes={episodes}
            currentEpisodeId={currentEpisode?.number.toString() || null}
            onEpisodeSelect={(ep) =>
              router.push(
                `/watch/${animeId}?ep=${
                  extractEpisodeNumber(ep.episodeId) || ep.number
                }`
              )
            }
          />
        </div>
        <div className="lg:col-span-9">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            {isLoadingSources ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : sourcesError ? (
              <ErrorDisplay
                    isCompact
                    onRetry={retry}
                    title="Stream Failed"
                    description={sourcesError}
                  />
            ): (
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                allowFullScreen
                className="h-full w-full"
              ></iframe>
            )}
          </div>
          <div className="mt-4">
            <PlayerOverlayControls
              onPrev={() => navigateEpisode('prev')}
              onNext={() => navigateEpisode('next')}
              isPrevDisabled={currentIndex <= 0}
              isNextDisabled={currentIndex >= episodes.length - 1}
            />
          </div>
          <div className="mt-4 flex flex-col gap-4 rounded-lg border border-border/50 bg-card p-3 md:flex-row md:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                You are watching Episode {currentEpisode?.number}
              </h2>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {currentEpisode?.title || `Episode ${currentEpisode?.number}`}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LanguageToggle
                onLanguageChange={(lang: Language) => setLanguage(lang)}
              />
              <ServerToggle 
                servers={availableServers}
                activeServer={selectedServer}
                onServerChange={(server) => setSelectedServer(server)} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-9">
          {currentEpisode && (
            <CommentsSection
              animeId={animeId}
              episodeId={currentEpisode.episodeId}
            />
          )}
        </div>
        <div className="lg:col-span-3">
          {about && (
            <WatchSidebar
              animeInfo={about.info}
              animeId={animeId}
              episodeId={currentEpisode?.episodeId || null}
              mostPopular={mostPopularAnimes}
            />
          )}
        </div>
      </div>
      {recommendedAnimes && recommendedAnimes.length > 0 && (
        <section className="pt-8">
          <h2 className="mb-4 border-l-4 border-primary pl-3 text-2xl font-bold">
            Recommended for you
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      }
    >
      <WatchPageComponent />
    </Suspense>
  );
}
