
'use client';
import { CharacterVoiceActor, AnimeInfo, AnimeAboutResponse, AnimeBase, PromotionalVideo, AnimeSeason } from '@/lib/types/anime';
import { useQuery } from '@tanstack/react-query';
import { Play, Clapperboard, Users, ShieldAlert, GitBranch, Star, BookmarkCheck, BookmarkPlus, Download, TvIcon, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import ErrorDisplay from '../common/ErrorDisplay';
import Synopsis from './Synopsis';
import { Badge } from '../ui/badge';
import { AnimeService } from '@/lib/services/AnimeService';
import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import CommentsContainer from '@/components/comments/CommentsContainer';
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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RankedAnimeSidebar from './RecommendedSidebar';
import ProgressiveImage from '../ProgressiveImage';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/client/useDoc';
import { db } from '@/firebase/client';
import { WatchlistItem } from '@/lib/types/watchlist';
import toast from 'react-hot-toast';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useTitleLanguageStore } from '@/store/title-language-store';
import CharacterCard from './CharacterCard';
import InfoSidebar from './InfoSidebar';
import { AnimeCard } from '../AnimeCard';


const SeasonsSwiper = dynamic(() => import('@/components/anime/SeasonsSwiper'), {
  loading: () => <Skeleton className="h-48 w-full" />,
  ssr: false
});
const PVCarousel = dynamic(() => import('@/components/anime/PVCarousel'), {
  loading: () => <Skeleton className="h-48 w-full" />,
  ssr: false
});


const extractEpisodeNumber = (id: string) => id.split('?ep=')[1] || null;

export default function AnimeDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useUser();
  const { language } = useTitleLanguageStore();
  const [showAgeGate, setShowAgeGate] = useState(false);
  
  const {
    data: animeResult,
    isLoading: isLoadingAnime,
    error,
    refetch,
  } = useQuery<AnimeAboutResponse>({
    queryKey: ['anime', id],
    queryFn: () => AnimeService.anime(id),
  });

  const { data: watchlistItem, loading: loadingWatchlist } = useDoc<WatchlistItem>(`users/${user?.uid}/watchlist/${id}`);
  const isInWatchlist = !!watchlistItem;
  
  const anime = animeResult?.anime;
  const animeInfo: AnimeInfo | undefined = anime?.info;
  const moreInfo = anime?.moreInfo;
  const seasons: AnimeSeason[] = animeResult?.seasons ?? [];
  const promotionalVideos: PromotionalVideo[] = animeInfo?.promotionalVideos ?? [];
  const recommendedAnimes = animeResult?.recommendedAnimes;
  const relatedAnimes = animeResult?.relatedAnimes;
  const characters: CharacterVoiceActor[] = animeInfo?.characterVoiceActors ?? [];

  useEffect(() => {
    if (animeInfo?.stats.rating === "R") {
        const hasAgreed = sessionStorage.getItem('age-gate-agreed');
        if (!hasAgreed) {
          setShowAgeGate(true);
        }
    }
  }, [animeInfo]);
  
  const handleAgeGateAgree = () => {
    sessionStorage.setItem('age-gate-agreed', 'true');
    setShowAgeGate(false);
  }

  const { data: episodesResult } = useQuery<any>({
    queryKey: ['episodes', id],
    queryFn: () => AnimeService.episodes(id),
    enabled: !!animeInfo
  });

  const episodes = episodesResult?.episodes || [];
  
  const isLoading = isLoadingAnime || loadingWatchlist;

  const handleWatchlistToggle = async () => {
    if (!user) {
        toast.error("You must be logged in to manage your watchlist.");
        router.push('/login');
        return;
    }
    const toastId = toast.loading(isInWatchlist ? "Removing from watchlist..." : "Adding to watchlist...");
    const docRef = doc(db, `users/${user.uid}/watchlist/${id}`);

    try {
        if (isInWatchlist) {
            await deleteDoc(docRef);
            toast.success("Removed from watchlist.", { id: toastId });
        } else {
            await setDoc(docRef, {
                id: id,
                status: 'Plan to Watch',
                addedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            toast.success("Added to watchlist!", { id: toastId });
        }
    } catch (e) {
        console.error("Watchlist error:", e);
        toast.error("Failed to update watchlist.", { id: toastId });
    }
  };


  if (isLoadingAnime) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  if (error || !animeResult) return <ErrorDisplay onRetry={refetch} />;
  if (!animeInfo || !moreInfo) return <ErrorDisplay title="Anime Not Found" description="The details for this anime could not be found." />;

  
  const firstEpisode = episodes?.[0];
  const firstEpisodeWatchId = firstEpisode ? (extractEpisodeNumber(firstEpisode.episodeId) || firstEpisode.number) : null;

  const stats = animeInfo.stats;
  const title = language === 'romaji' && moreInfo.japanese ? moreInfo.japanese : animeInfo.name;
  
  return (
    <div className="min-h-screen text-foreground">
        <AlertDialog open={showAgeGate} onOpenChange={setShowAgeGate}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-destructive" />
                        Age-Restricted Content
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This anime is rated for mature audiences only. Please confirm you are 18 years or older to proceed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => router.push('/home')}>Leave</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAgeGateAgree}>Enter</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* Hero Section */}
        <div className="relative h-auto md:h-auto overflow-hidden -mt-16">
          <div className="absolute inset-0 z-0">
            <ProgressiveImage
              src={animeInfo.poster}
              alt={animeInfo.name || "Anime Banner"}
              fill
              className="object-cover opacity-10 blur-xl scale-110"
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          </div>

          <div className="container mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-20 md:py-28">
            <div className="md:col-span-3 flex justify-center md:justify-start">
              <ProgressiveImage
                src={animeInfo.poster}
                alt={animeInfo.name || "Anime Poster"}
                width={250}
                height={380}
                className="rounded-xl shadow-2xl shadow-black/50 w-48 md:w-[250px] object-cover transition-all duration-300 hover:scale-105"
                priority
              />
            </div>
            
            <div className="md:col-span-9 flex flex-col justify-center h-full text-center md:text-left">
              <div className="text-sm text-muted-foreground hidden sm:block">Home &gt; {stats.type} &gt; {animeInfo.name}</div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold mt-2 text-glow">{title}</h1>
              
              <div className="flex items-center justify-center md:justify-start flex-wrap gap-2 text-sm text-muted-foreground mt-4">
                  {stats.rating && stats.rating !== 'N/A' && <Badge variant={stats.rating === 'R' ? 'destructive' : 'secondary'} className="px-2 py-1">{stats.rating}</Badge>}
                  <span className="px-2 py-1 bg-card rounded-md border border-border">{stats.quality}</span>
                  {stats.episodes.sub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-card rounded-md border border-border">
                          <Clapperboard className="w-3 h-3" /> SUB {stats.episodes.sub}
                      </span>
                  )}
                  {stats.episodes.dub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">
                         DUB {stats.episodes.dub}
                      </span>
                  )}
                  <span className="text-sm text-muted-foreground">&bull; {stats.type} &bull; {stats.duration}</span>
              </div>

              <div className="mt-6 max-w-3xl mx-auto md:mx-0">
                <Synopsis description={animeInfo.description} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
                {firstEpisodeWatchId && (
                  <Button asChild size="lg" className="shadow-lg shadow-primary/30 bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-12 px-8">
                    <Link href={`/watch/${animeInfo.id}?ep=${firstEpisodeWatchId}`} className="flex items-center justify-center gap-2">
                        <Play /> Watch Now
                    </Link>
                  </Button>
                )}
                 <Button onClick={handleWatchlistToggle} size="lg" variant="secondary" className="h-12 px-8 text-lg" disabled={isLoading}>
                    {isInWatchlist ? <BookmarkCheck className="mr-2"/> : <BookmarkPlus className="mr-2"/>} {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
              </div>
              
              <p className="text-muted-foreground text-xs mt-4 max-w-3xl mx-auto md:mx-0">
                <Link href="/" className="text-primary hover:underline">ProjectX</Link> is the best site to watch <Link href={`/anime/${animeInfo.id}`} className="text-primary hover:underline">{animeInfo.name}</Link> SUB online, or you can even watch <Link href={`/anime/${animeInfo.id}`} className="text-primary hover:underline">{animeInfo.name}</Link> DUB in HD quality. You can also find various anime on <Link href="/" className="text-primary hover:underline">ProjectX</Link> website.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto -mt-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-9 order-2 lg:order-1 space-y-12">
                  <SeasonsSwiper seasons={seasons} currentAnimeId={id} />

                  <PVCarousel videos={promotionalVideos} fallbackPoster={animeInfo.poster} />
                  
                  {characters.length > 0 && (
                    <section>
                       <h2 className="text-title mb-4 border-l-4 border-primary pl-3 flex items-center gap-2"><Users /> Characters & Voice Actors</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {characters.slice(0, 10).map(cv => (
                                <CharacterCard key={cv.character.id} cv={cv} />
                            ))}
                        </div>
                    </section>
                  )}
                 {animeInfo.id && <CommentsContainer animeId={animeInfo.id} />}

                 {recommendedAnimes && recommendedAnimes.length > 0 && (
                    <section className="pt-8">
                       <h2 className="text-title mb-4 border-l-4 border-primary pl-3">Recommended for you</h2>
                       <div className="grid-cards">
                           {recommendedAnimes.map(anime => (
                               <AnimeCard key={anime.id} anime={anime} />
                           ))}
                       </div>
                    </section>
                 )}
              </div>

              <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
                  <InfoSidebar moreInfo={moreInfo} />
                 {relatedAnimes && relatedAnimes.length > 0 && (
                    <RankedAnimeSidebar title="Related Anime" animes={relatedAnimes} icon={<GitBranch className="w-5 h-5"/>} />
                 )}
                 {animeResult?.mostPopularAnimes && animeResult.mostPopularAnimes.length > 0 && (
                    <RankedAnimeSidebar title="Most Popular" animes={animeResult.mostPopularAnimes} icon={<Star className="w-5 h-5"/>} />
                 )}
              </div>
            </div>
        </div>
    </div>
  );
}

    