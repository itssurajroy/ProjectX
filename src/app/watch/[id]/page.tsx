'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Share2, Bookmark, Lightbulb, Expand, SkipForward, SkipBack, Volume2, Settings, AlertCircle, Home, Tv, Play, Video, Users, Focus, Heart, Flag, Clapperboard, MonitorPlay, Film, Clock, Search, List, Captions, Mic, X, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn, sanitizeFirestoreId } from '@/lib/utils';
import { AnimeService, extractEpisodeNumber } from '@/lib/AnimeService';
import EpisodeList from '@/components/watch/episode-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { AnimeEpisode, AnimeAboutResponse, EpisodeSourcesResponse } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import CommentsSection from '@/components/watch/comments';
import PollsSection from '@/components/watch/PollsSection';
import WatchHero from '@/components/watch/WatchHero';
import EpisodeCountdown from '@/components/watch/EpisodeCountdown';
import PlayerOverlayControls from '@/components/watch/PlayerOverlayControls';
import ServerToggle from '@/components/watch/ServerToggle';
import LanguageToggle from '@/components/watch/LanguageToggle';
import ShareBanner from '@/components/watch/ShareBanner';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

function WatchPageComponent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const firestore = useFirestore();

  const animeId = params.id as string;
  const episodeParam = searchParams.get('ep');

  const { data: aboutResponse, isLoading: isLoadingAbout, error: aboutError, refetch: refetchAbout } = useQuery<{data: AnimeAboutResponse} | { success: false, error: string }>({
    queryKey: ['anime', animeId],
    queryFn: () => AnimeService.getAnimeAbout(animeId),
    enabled: !!animeId,
  });

  const { data: episodesResponse, isLoading: isLoadingEpisodes, error: episodesError, refetch: refetchEpisodes } = useQuery({
    queryKey: ["anime-episodes", animeId],
    queryFn: () => AnimeService.getEpisodes(animeId),
    enabled: !!animeId,
  });

  const [lastWatchedEp, setLastWatchedEp] = useState<string | null>(null);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
  
  const episodes: AnimeEpisode[] = useMemo(() => episodesResponse && 'data' in episodesResponse ? episodesResponse.data.episodes : [], [episodesResponse]);
  const about = useMemo(() => aboutResponse && 'data' in aboutResponse ? aboutResponse.data.anime : null, [aboutResponse]);
  const seasons = useMemo(() => aboutResponse && 'data' in aboutResponse ? aboutResponse.data.seasons : [], [aboutResponse]);

  const currentEpisode = useMemo(() => {
    if (!episodes || episodes.length === 0) return null;
    const epNum = episodeParam || lastWatchedEp || '1';
    return episodes.find(e => {
        const extractedEp = extractEpisodeNumber(e.episodeId);
        return extractedEp === epNum || String(e.number) === epNum;
    }) || episodes[0];
  }, [episodes, episodeParam, lastWatchedEp]);

   const { data: sourcesResponse, isLoading: isLoadingSources, error: sourcesError } = useQuery<EpisodeSourcesResponse | { success: false, error: string }>({
      queryKey: ["episode-sources", currentEpisode?.episodeId],
      queryFn: () => AnimeService.getEpisodeSources(currentEpisode!.episodeId, 'hd-1', language),
      enabled: !!currentEpisode,
  });
  
  const historyRef = useMemoFirebase(() => {
    if (user && animeId && !user.isAnonymous) {
      const sanitizedId = sanitizeFirestoreId(animeId);
      return doc(firestore, 'users', user.uid, 'history', sanitizedId);
    }
    return null;
  }, [user, animeId, firestore]);

  useEffect(() => {
    if (historyRef && episodeParam) {
      setDoc(historyRef, { 
        episodeId: episodeParam,
        updatedAt: serverTimestamp(),
        name: about?.info.name,
        poster: about?.info.poster,
        id: animeId,
      }, { merge: true }).catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: historyRef.path,
            operation: 'update',
            requestResourceData: { episodeId: episodeParam },
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  }, [historyRef, episodeParam, about, animeId]);
  
  useEffect(() => {
      if (historyRef) {
          getDoc(historyRef).then(docSnap => {
              if (docSnap.exists()) {
                  setLastWatchedEp(docSnap.data().episodeId);
              }
          });
      }
  }, [historyRef]);

  useEffect(() => {
    if (isLoadingEpisodes || !episodes) return;
    
    if (episodes.length > 0 && !episodeParam) {
      const targetEpId = lastWatchedEp || extractEpisodeNumber(episodes[0].episodeId) || episodes[0].number;
      if (targetEpId) {
        router.replace(`/watch/${animeId}?ep=${targetEpId}`);
      }
    }
  }, [animeId, router, lastWatchedEp, episodeParam, episodes, isLoadingEpisodes]);

  
  const navigateEpisode = (dir: 'next' | 'prev') => {
    if (!episodes.length || !currentEpisode) return;
    const currentIndex = episodes.findIndex((ep) => ep.episodeId === currentEpisode.episodeId);
    if (currentIndex === -1) return;
    const newIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= episodes.length) return;
    const nextEpId = extractEpisodeNumber(episodes[newIndex].episodeId) || episodes[newIndex].number;
    router.push(`/watch/${animeId}?ep=${nextEpId}`);
  };

  const iframeSrc = sourcesResponse && 'sources' in sourcesResponse ? sourcesResponse.sources[0]?.url : undefined;
  
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

  const nextAiring = about?.moreInfo?.nextAiring;
  const currentIndex = episodes.findIndex((ep) => ep.episodeId === currentEpisode?.episodeId);

  return (
     <main className="min-h-screen bg-background text-foreground pb-16 md:pb-0">
        <WatchHero animeInfo={about.info} />
        
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9 xl:col-span-9 space-y-6">
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
                  <div className="flex gap-4">
                    <LanguageToggle onLanguageChange={(lang) => setLanguage(lang)} />
                    <ServerToggle onServerChange={(server) => console.log(server)} />
                  </div>
                </div>

                <EpisodeCountdown airingTime={nextAiring?.airingTime} />
                <ShareBanner />
                <PollsSection animeId={animeId} episodeId={episodeParam} />

                {seasons && seasons.length > 1 && (
                    <div className='mt-4'>
                        <h3 className='font-bold text-lg mb-2'>Seasons</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {seasons.map(season => (
                                <Link key={season.id} href={`/watch/${season.id}`}>
                                    <div className={cn("relative aspect-[2/3] rounded-md overflow-hidden group border-2", season.id === animeId ? "border-primary" : "border-transparent")}>
                                        <Image src={season.poster} alt={season.title} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                                            <p className="text-white font-semibold text-xs line-clamp-2">{season.title}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                <CommentsSection animeId={animeId} episodeId={episodeParam || ''} />
            </div>

            <div className="lg:col-span-3 hidden lg:block sticky top-20 h-max">
                 <EpisodeList 
                    episodes={episodes} 
                    currentEpisodeId={currentEpisode?.number.toString() || null} 
                    onEpisodeSelect={(ep) => router.push(`/watch/${animeId}?ep=${extractEpisodeNumber(ep.episodeId) || ep.number}`)}
                />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="fixed bottom-20 right-5 z-40 lg:hidden rounded-full h-14 w-14 shadow-lg">
                    <List className="w-6 h-6" />
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
                    onEpisodeSelect={(ep) => {
                      router.push(`/watch/${animeId}?ep=${extractEpisodeNumber(ep.episodeId) || ep.number}`)
                    }}
                  />
                </SheetClose>
              </SheetContent>
            </Sheet>
        </div>
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
