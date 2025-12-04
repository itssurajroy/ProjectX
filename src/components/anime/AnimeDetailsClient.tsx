
'use client';
import { CharacterVoiceActor, AnimeInfo, AnimeAboutResponse, AnimeBase, PromotionalVideo, AnimeSeason } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { Play, Clapperboard, Users, ShieldAlert, GitBranch, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Synopsis from './Synopsis';
import { Badge } from '../ui/badge';
import { AnimeService } from '@/lib/AnimeService';
import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Bookmark } from 'lucide-react';
import CommentSection from '@/components/CommentSection';
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


const SeasonsSwiper = dynamic(() => import('@/components/anime/SeasonsSwiper'), {
  loading: () => <Skeleton className="h-48 w-full" />,
  ssr: false
});
const PVCarousel = dynamic(() => import('@/components/anime/PVCarousel'), {
  loading: () => <Skeleton className="h-48 w-full" />,
  ssr: false
});


const extractEpisodeNumber = (id: string) => id.split('?ep=')[1] || null;

const CharacterCard = ({ cv }: { cv: CharacterVoiceActor }) => (
    <div className="bg-card rounded-lg overflow-hidden flex border border-border">
        {/* Character */}
        <div className="w-1/2 flex items-center gap-3 p-3">
            <div className="relative aspect-[2/3] w-12 flex-shrink-0">
                <Image src={cv.character.poster} alt={cv.character.name} fill loading="lazy" className="object-cover rounded-md" />
            </div>
            <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-primary truncate">{cv.character.name}</h4>
                <p className="text-xs text-muted-foreground">{cv.character.cast}</p>
            </div>
        </div>

        {/* Voice Actor */}
        {cv.voiceActor && (
            <div className="w-1/2 flex items-center gap-3 p-3 bg-muted/30 justify-end text-right">
                <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{cv.voiceActor.name}</p>
                    <p className="text-xs text-muted-foreground">{cv.voiceActor.cast}</p>
                </div>
                <div className="relative aspect-square w-12 flex-shrink-0">
                    <Image src={cv.voiceActor.poster} alt={cv.voiceActor.name} fill loading="lazy" className="rounded-full object-cover" />
                </div>
            </div>
        )}
    </div>
);


export default function AnimeDetailsClient({ id }: { id: string }) {
  const router = useRouter();
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
        setShowAgeGate(true);
    }
  }, [animeInfo]);

  const { data: episodesResult } = useQuery<any>({
    queryKey: ['episodes', id],
    queryFn: () => AnimeService.episodes(id),
    enabled: !!animeInfo
  });

  const episodes = episodesResult?.episodes || [];
  
  const isLoading = isLoadingAnime;

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  if (error || !animeResult) return <ErrorDisplay onRetry={refetch} />;
  if (!animeInfo || !moreInfo) return <ErrorDisplay title="Anime Not Found" description="The details for this anime could not be found." />;

  
  const firstEpisode = episodes?.[0];
  const firstEpisodeWatchId = firstEpisode ? (extractEpisodeNumber(firstEpisode.episodeId) || firstEpisode.number) : null;

  const stats = animeInfo.stats;
  
  return (
    <div className="min-h-screen bg-background text-foreground">
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
                    <AlertDialogAction onClick={() => setShowAgeGate(false)}>Enter</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <div className="relative h-auto md:h-auto overflow-hidden -mt-16">
          <div className="absolute inset-0 z-0">
            <Image
              src={animeInfo.poster}
              alt={animeInfo.name}
              fill
              className="object-cover opacity-10 blur-xl scale-110"
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          </div>

          <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-20 md:py-28">
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <Image
                src={animeInfo.poster}
                alt={animeInfo.name}
                width={250}
                height={380}
                className="rounded-xl shadow-2xl shadow-black/50 w-48 md:w-[250px] object-cover transition-all duration-300 hover:scale-105"
                priority
              />
            </div>
            
            <div className="lg:col-span-9 flex flex-col justify-center h-full text-center lg:text-left">
              <div className="text-sm text-muted-foreground hidden sm:block">Home &gt; {stats.type} &gt; {animeInfo.name}</div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold mt-2 text-glow">{animeInfo.name}</h1>
              
              <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 text-sm text-muted-foreground mt-4">
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

              <div className="mt-6 max-w-3xl mx-auto lg:mx-0">
                <Synopsis description={animeInfo.description} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
                {firstEpisodeWatchId && (
                  <Button asChild size="lg" className="shadow-lg shadow-primary/30 bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-12 px-8">
                    <Link href={`/watch/${animeInfo.id}?ep=${firstEpisodeWatchId}`} className="flex items-center justify-center gap-2">
                        <Play /> Watch Now
                    </Link>
                  </Button>
                )}
                 <Button size="lg" variant="secondary" className="h-12 px-8 text-lg">
                    <Bookmark /> Add to Watchlist
                </Button>
              </div>
              
              <p className="text-muted-foreground text-xs mt-4 max-w-3xl mx-auto lg:mx-0">
                <Link href="/" className="text-primary hover:underline">ProjectX</Link> is the best site to watch <Link href={`/anime/${animeInfo.id}`} className="text-primary hover:underline">{animeInfo.name}</Link> SUB online, or you can even watch <Link href={`/anime/${animeInfo.id}`} className="text-primary hover:underline">{animeInfo.name}</Link> DUB in HD quality. You can also find various anime on <Link href="/" className="text-primary hover:underline">ProjectX</Link> website.
              </p>
            </div>
          </div>
        </div>

      <div className="container mx-auto -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 bg-card p-4 rounded-xl border border-border self-start">
                <div className="space-y-3 text-sm">
                    {Object.entries(moreInfo).map(([key, value]) => {
                       if (!value || (Array.isArray(value) && value.length === 0)) return null;
                       const label = key.charAt(0).toUpperCase() + key.slice(1);
                       
                       return (
                         <div key={key} className="flex justify-between border-b border-border/50 pb-2 last:border-b-0">
                            <span className="font-bold text-foreground/80">{label}:</span>
                            {key === 'genres' && Array.isArray(value) ? (
                                <div className="flex flex-wrap items-center justify-end gap-1 max-w-[60%]">
                                    {value.map((genre: string) => (
                                        <Link key={genre} href={`/search?genres=${genre.toLowerCase().replace(/ /g, '-')}`} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md hover:text-primary hover:bg-muted/50">{genre}</Link>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted-foreground text-right">{Array.isArray(value) ? value.join(', ') : value}</span>
                            )}
                         </div>
                       )
                    })}
                </div>
            </div>

          <div className="lg:col-span-6 space-y-12">
              <SeasonsSwiper seasons={seasons} currentAnimeId={id} />

              <PVCarousel videos={promotionalVideos} fallbackPoster={animeInfo.poster} />
              
              {characters.length > 0 && (
                <section>
                   <h2 className="text-title mb-4 border-l-4 border-primary pl-3 flex items-center gap-2"><Users /> Characters & Voice Actors</h2>
                    <div className="grid grid-cols-1 gap-2">
                        {characters.slice(0, 10).map(cv => (
                            <CharacterCard key={cv.character.id} cv={cv} />
                        ))}
                    </div>
                </section>
              )}
             <CommentSection animeId={id} />
          </div>
          <div className="lg:col-span-3 space-y-6">
             {relatedAnimes && relatedAnimes.length > 0 && (
                <RankedAnimeSidebar title="Related Anime" animes={relatedAnimes} icon={<GitBranch className="w-5 h-5"/>} />
             )}
             {recommendedAnimes && recommendedAnimes.length > 0 && (
                <RankedAnimeSidebar title="Recommended" animes={recommendedAnimes} icon={<Star className="w-5 h-5"/>} />
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
