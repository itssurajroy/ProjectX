
'use client';

import { Suspense, useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Menu } from 'lucide-react';
import EpisodeList from '@/components/watch/episode-list';
import { AnimeEpisode, AnimeAboutResponse, Source, Subtitle, AnimeAbout } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import PlayerOverlayControls from '@/components/watch/PlayerOverlayControls';
import LanguageToggle, { Language } from '@/components/watch/LanguageToggle';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Breadcrumb from '@/components/common/Breadcrumb';
import { AnimeCard } from '@/components/AnimeCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AnimeService } from '@/lib/AnimeService';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import AnimePlayer from '@/components/AnimePlayer';
import EpisodeCountdown from '@/components/watch/EpisodeCountdown';
import ServerToggle from '@/components/watch/ServerToggle';
import { getMALId } from '@/lib/anime/malResolver';
import { MALService } from '@/lib/MALService';
import { cn } from '@/lib/utils';
import { usePlayerSettings } from '@/store/player-settings';
import CommentsContainer from '@/components/comments/CommentsContainer';
import AnimeSchedule from '@/components/watch/AnimeSchedule';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const WatchSidebar = dynamic(() => import('@/components/watch/WatchSidebar'), { ssr: false });

const extractEpisodeNumber = (id: string) => id.split('?ep=')[1] || null;

interface SourcesData {
    sources: Source[];
    subtitles: Subtitle[];
    message?: string;
    anilistID?: number;
    malID?: number;
}

function WatchPageComponent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const { user } = useUser();

  const animeId = params.id as string;
  const episodeParam = searchParams.get('ep');

  const [language, setLanguage] = useState<Language>('sub');
  const { isFocusMode, toggleFocusMode } = usePlayerSettings();
  const [showFillerAlert, setShowFillerAlert] = useState(false);
  
  const {
    data: aboutResponse,
    isLoading: isLoadingAbout,
    error: aboutError,
    refetch: refetchAbout,
  } = useQuery<AnimeAboutResponse>(
    {
      queryKey: ['anime', animeId],
      queryFn: () => AnimeService.anime(animeId),
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
    queryFn: () => AnimeService.episodes(animeId),
    enabled: !!animeId,
  });

  const about = useMemo(() => aboutResponse?.anime, [aboutResponse]);

  const malId = about?.moreInfo?.malId;

  const { data: malData } = useQuery({
    queryKey: ['mal-data', malId],
    queryFn: () => MALService.getById(malId!),
    enabled: !!malId,
  });

  const episodes: AnimeEpisode[] = useMemo(
    () => episodesResponse?.episodes || [],
    [episodesResponse]
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

  useEffect(() => {
    if (currentEpisode?.isFiller) {
      setShowFillerAlert(true);
    }
  }, [currentEpisode]);

  const { 
    data: sourcesData, 
 } = useQuery<SourcesData>({
    queryKey: ['episode-sources', currentEpisode?.episodeId, language],
    queryFn: () => AnimeService.getEpisodeSources(currentEpisode!.episodeId, language),
    enabled: !!currentEpisode,
    retry: false, // Let the player handle retries
  });
  
  const nextAiringTime = aboutResponse?.anime.moreInfo.nextAiringEpisode?.airingTime;


  useEffect(() => {
    if (isLoadingEpisodes || !episodes) return;

    if (episodes.length > 0 && !episodeParam) {
      const firstEpisode = episodes[0];
      const targetEpId = extractEpisodeNumber(firstEpisode.episodeId) || firstEpisode.number;
      if (targetEpId) {
        router.replace(`/watch/${animeId}?ep=${targetEpId}`);
      }
    }
  }, [animeId, router, episodeParam, episodes, isLoadingEpisodes]);

  const navigateEpisode = useCallback((dir: 'next' | 'prev') => {
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
  }, [episodes, currentEpisode, animeId, router]);
  
  const handleEpisodeSelect = useCallback((episode: AnimeEpisode) => {
      const epId = extractEpisodeNumber(episode.episodeId) || episode.number;
      router.push(`/watch/${animeId}?ep=${epId}`);
  }, [animeId, router]);

  const handleCreateW2G = async () => {
    if (!user) {
      toast.error('You must be logged in to create a Watch Together room.');
      router.push('/login');
      return;
    }
    if (!currentEpisode || !about) {
      toast.error('Could not get anime details to create a room.');
      return;
    }

    const toastId = toast.loading('Creating Watch Together room...');

    try {
      const roomCollection = collection(firestore, 'watch2gether_rooms');
      const roomData = {
        name: `${user.displayName || 'Anonymous'}'s Watch Party`,
        animeId: about.info.id,
        animeName: about.info.name,
        animePoster: about.info.poster,
        episodeId: currentEpisode.episodeId,
        episodeNumber: currentEpisode.number,
        hostId: user.uid,
        createdAt: serverTimestamp(),
        playerState: {
          isPlaying: false,
          currentTime: 0,
          updatedAt: serverTimestamp(),
        },
      };

      const newRoomDoc = await addDoc(roomCollection, roomData);
      toast.success('Room created! Redirecting...', { id: toastId });
      router.push(`/watch2gether/${newRoomDoc.id}`);
    } catch (error) {
      console.error('Error creating Watch Together room:', error);
      toast.error('Failed to create room. You may not have permission.', { id: toastId });
    }
  };

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
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {isFocusMode && (
            <div 
                className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm"
                onClick={toggleFocusMode}
            />
        )}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/home' },
          { label: about.info.stats.type, href: `/search?type=${about.info.stats.type}` },
          { label: about.info.name, href: `/anime/${animeId}` },
          { label: `Episode ${currentEpisode?.number}` },
        ]}
      />

      <AlertDialog open={showFillerAlert} onOpenChange={setShowFillerAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>This is a Filler Episode</AlertDialogTitle>
            <AlertDialogDescription>
              This episode is marked as filler content. You can choose to watch it or skip directly to the next episode.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Watch Anyway</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigateEpisode('next')}>
              Skip to Next Episode
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6">
        <div className="hidden lg:block lg:col-span-3">
          { about && <WatchSidebar anime={about} malData={malData} /> }
        </div>

        <div className={cn("lg:col-span-6 space-y-4", isFocusMode && "relative z-40")}>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                {currentEpisode ? (
                    <AnimePlayer 
                        episodeId={currentEpisode.episodeId} 
                        animeId={animeId}
                        onNext={() => navigateEpisode('next')}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Selecting episode...</p>
                    </div>
                )}
            </div>
            <PlayerOverlayControls
                onPrev={() => navigateEpisode('prev')}
                onNext={() => navigateEpisode('next')}
                onW2G={handleCreateW2G}
                isPrevDisabled={currentIndex <= 0}
                isNextDisabled={currentIndex >= episodes.length - 1}
                />
           
           <div className="bg-card/50 p-3 rounded-lg border border-border/50 space-y-3">
                <p className="font-semibold text-lg">You are watching Episode {currentEpisode?.number}</p>
                <ServerToggle onLanguageChange={setLanguage} />
           </div>
           
           <AnimeSchedule animeId={animeId} animeName={about.info.name} />
           <EpisodeCountdown airingTime={nextAiringTime} />
            
          {currentEpisode && (
            <CommentsContainer
              animeId={animeId}
              episodeId={currentEpisode.episodeId}
              availableEpisodes={episodes}
            />
          )}
        </div>

        <div className="lg:col-span-3">
            <EpisodeList 
                episodes={episodes}
                currentEpisodeId={currentEpisode?.episodeId || null}
                onEpisodeSelect={handleEpisodeSelect}
            />
        </div>
      </div>
    </div>
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
