'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams, useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ChevronLeft, ChevronRight, AlertTriangle, Star } from 'lucide-react';
import { cn, extractEpisodeId, sanitizeFirestoreId } from '@/lib/utils';
import { useUser, useFirestore, useAuth, useMemoFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimeService } from '@/lib/AnimeService';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import EpisodeList from '@/components/watch/episode-list';
import { useQuery } from '@tanstack/react-query';
import { AnimeAbout, AnimeEpisode } from '@/types/anime';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import AdvancedMegaPlayPlayer from '@/components/player/AdvancedMegaPlayPlayer';
import CommentsSection from '@/components/watch/comments';
import PollsSection from '@/components/watch/PollsSection';

const AnimeInfoCard = ({ animeId }: { animeId: string }) => {
    const { data: aboutResponse, isLoading } = useQuery({
      queryKey: ["anime-about", animeId],
      queryFn: () => AnimeService.getAnimeAbout(animeId),
      enabled: !!animeId,
    });
  
    const anime = aboutResponse && 'data' in aboutResponse ? aboutResponse.data.anime : null;

    if (isLoading || !anime) {
        return (
            <div className="bg-card rounded-lg p-4 border border-border/50">
                <Skeleton className="w-full h-[300px] rounded-lg" />
                <Skeleton className="h-6 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
                <div className="flex gap-2 mt-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                </div>
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        )
    }
  
    return (
      <div className="bg-card rounded-lg p-4 border border-border/50 sticky top-20">
          <Image src={anime.info.poster} alt={anime.info.name} width={300} height={450} className="rounded-lg w-full shadow-lg"/>
          <h1 className="text-xl font-bold mt-4">{anime.info.name}</h1>
          {anime.moreInfo.japanese && <p className="text-sm text-muted-foreground">{anime.moreInfo.japanese}</p>}
          <div className="flex items-center gap-2 flex-wrap mt-3">
              <Badge variant="secondary">{anime.info.stats.type}</Badge>
              <Badge variant="secondary">{anime.moreInfo.status}</Badge>
              {anime.moreInfo.season && <Badge variant="secondary">{anime.moreInfo.season}</Badge>}
          </div>
          <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg">{anime.moreInfo.malscore}</span>
              </div>
              <p className="text-xs text-muted-foreground">({anime.info.stats.rating})</p>
          </div>
  
          <div className="mt-4 space-y-2 text-sm">
              <p className="line-clamp-5 text-muted-foreground" dangerouslySetInnerHTML={{ __html: anime.info.description || "No synopsis available."}}/>
          </div>
  
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              {Object.entries({
                  Country: anime.moreInfo.country,
                  Genres: anime.moreInfo.genres?.join(', '),
                  Premiered: anime.moreInfo.premiered,
                  Duration: anime.info.stats.duration,
                  Studios: anime.moreInfo.studios,
              }).map(([label, value]) => (
                  value && <div key={label} className="flex">
                      <span className="font-bold text-foreground/80 w-20 flex-shrink-0">{label}:</span>
                      <span className="truncate">{value}</span>
                  </div>
              ))}
          </div>
      </div>
  );
};

// --- MAIN PAGE ---
function WatchPageComponent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const firestore = useFirestore();

  const animeId = params.id as string;
  const episodeParam = searchParams.get('ep');
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [lastWatchedEp, setLastWatchedEp] = useState<string | null>(null);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: episodesResponse, isLoading: loadingEpisodes } = useQuery({
    queryKey: ["anime-episodes", animeId],
    queryFn: () => AnimeService.getEpisodes(animeId),
    enabled: !!animeId,
  });

  useEffect(() => {
    if (episodesResponse && 'data' in episodesResponse) {
      setEpisodes(episodesResponse.data.episodes);
    } else if (episodesResponse && 'error' in episodesResponse) {
      toast.error("Failed to fetch episodes.");
      console.error("Failed to fetch episodes:", episodesResponse.error);
    }
  }, [episodesResponse]);


  const historyRef = useMemoFirebase(() => {
    if (user && animeId && !user.isAnonymous) {
      return doc(firestore, 'users', user.uid, 'history', animeId);
    }
    return null;
  }, [user, animeId, firestore]);

  // --- Track watch history ---
  useEffect(() => {
    if (historyRef && episodeParam) {
      setDoc(historyRef, { 
        episodeId: episodeParam,
        updatedAt: serverTimestamp() 
      }, { merge: true }).catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: historyRef.path,
            operation: 'update',
            requestResourceData: { episodeId: episodeParam },
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  }, [historyRef, episodeParam]);
  
  // --- Fetch last watched episode ---
  useEffect(() => {
      if (historyRef) {
          getDoc(historyRef).then(docSnap => {
              if (docSnap.exists()) {
                  setLastWatchedEp(docSnap.data().episodeId);
              }
          });
      }
  }, [historyRef]);

  // --- Fetch episodes and handle routing ---
  useEffect(() => {
    if (loadingEpisodes) return;
    
    if (episodes.length > 0 && !episodeParam) {
      const targetEpId = lastWatchedEp || extractEpisodeId(episodes[0].episodeId);
      if (targetEpId) {
        router.replace(`/watch/${animeId}?ep=${targetEpId}`);
      }
    }
    setLoading(false);
  }, [animeId, router, lastWatchedEp, episodeParam, episodes, loadingEpisodes]);
  
  // --- Navigate between episodes ---
  const navigateEpisode = (dir: 'next' | 'prev') => {
    if (!episodes.length || !episodeParam) return;
    const currentIndex = episodes.findIndex((ep) => extractEpisodeId(ep.episodeId) === episodeParam);
    if (currentIndex === -1) {
        // If current episode is not in the list (e.g. invalid param), go to first episode.
        const firstEpId = extractEpisodeId(episodes[0].episodeId);
        if(firstEpId) router.push(`/watch/${animeId}?ep=${firstEpId}`);
        return;
    };
    const newIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= episodes.length) return;
    const nextEpId = extractEpisodeId(episodes[newIndex].episodeId);
    if (nextEpId) {
        router.push(`/watch/${animeId}?ep=${nextEpId}`);
    }
  };

  const currentEpisode = episodes.find(e => extractEpisodeId(e.episodeId) === episodeParam);
  const iframeSrc = `https://megaplay.buzz/stream/s-2/${currentEpisode?.episodeId}`;
  
  const handleNextEpisode = () => {
    navigateEpisode('next');
  };

  if (!isClient || (loading && episodes.length === 0)) {
     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>;
  }
  
  if (!loading && episodes.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center h-screen text-center px-4">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold">No Episodes Found</h1>
            <p className="text-muted-foreground max-w-md mt-2">
                We couldn&apos;t find any episodes for this anime. It might be a new release or there could be a temporary issue with our provider.
            </p>
            <Link href={`/anime/${animeId}`} className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold">
                Back to Anime Details
            </Link>
        </div>
    );
  }


  return (
    <main className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 hidden lg:block">
                <AnimeInfoCard animeId={animeId} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6">
                {/* Breadcrumbs */}
                <div className="text-sm text-muted-foreground mb-4">
                    <Link href="/home" className="hover:text-primary">Home</Link> &gt; 
                    <Link href={`/anime/${animeId}`} className="hover:text-primary capitalize">{animeId.replace(/-/g, ' ')}</Link> &gt; 
                    <span className="text-primary font-medium">Episode {currentEpisode?.number || '...'}</span>
                </div>

                {/* Player Section */}
                <div className="mb-6">
                   {currentEpisode ? (
                        <AdvancedMegaPlayPlayer
                          key={iframeSrc} // Re-renders iframe when src changes
                          iframeSrc={iframeSrc}
                          server="MegaPlay"
                          title={currentEpisode.title}
                          episode={String(currentEpisode.number)}
                          onNextEpisode={handleNextEpisode}
                        />
                    ) : (
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-primary w-12 h-12" />
                        </div>
                    )}
                </div>

                 {/* Episode & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
                    <div>
                    <h1 className="text-xl md:text-2xl font-bold text-primary line-clamp-1">
                        Ep. {currentEpisode?.number}: {currentEpisode?.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">You are watching episode {currentEpisode?.number}.</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={() => navigateEpisode('prev')}
                        className="flex items-center gap-1 bg-muted px-3 py-2 rounded-md hover:bg-muted/80 disabled:opacity-50"
                        disabled={episodes.findIndex((e) => extractEpisodeId(e.episodeId) === episodeParam) === 0}
                    >
                        <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                        onClick={() => navigateEpisode('next')}
                        className="flex items-center gap-1 bg-muted px-3 py-2 rounded-md hover:bg-muted/80 disabled:opacity-50"
                        disabled={
                           episodes.findIndex((e) => extractEpisodeId(e.episodeId) === episodeParam) >= episodes.length - 1
                        }
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                    </div>
                </div>

                {/* Language selection */}
                <div className="flex items-center gap-2 mb-6">
                    <button
                        onClick={() => setLanguage('sub')}
                        className={cn('px-4 py-2 rounded-md font-semibold', language === 'sub' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}
                    >
                        SUB
                    </button>
                    <button
                        onClick={() => setLanguage('dub')}
                        className={cn('px-4 py-2 rounded-md font-semibold', language === 'dub' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}
                    >
                        DUB
                    </button>
                </div>


                {/* Polls & Community Features */}
                <PollsSection animeId={animeId} episodeId={episodeParam} />

                {/* Comments Section */}
                <CommentsSection animeId={animeId} episodeId={episodeParam || ''} />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
                 <EpisodeList episodes={episodes} currentEpisodeId={episodeParam} onEpisodeSelect={(ep) => router.push(`/watch/${animeId}?ep=${extractEpisodeId(ep.episodeId)}`)} />
            </div>
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
