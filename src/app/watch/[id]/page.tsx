'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Share2, Bookmark, Lightbulb, Expand, SkipForward, SkipBack, Volume2, Settings, AlertCircle, Home, Tv, Play, Video, Users, Focus, Heart, Flag, Clapperboard, MonitorPlay, Film, Clock, Search, List, Captions, Mic, X, Loader2, Info } from 'lucide-react';
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';
import toast from 'react-hot-toast';
import { cn, extractEpisodeId, sanitizeFirestoreId } from '@/lib/utils';
import { AnimeService } from '@/lib/AnimeService';
import EpisodeList from '@/components/watch/episode-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { AnimeEpisode, AnimeAboutResponse } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import CommentsSection from '@/components/watch/comments';
import PollsSection from '@/components/watch/PollsSection';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const CountdownTimer = ({ targetDate }: { targetDate: number | null }) => {
    if (!targetDate) return null;
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const secondsRemaining = differenceInSeconds(new Date(targetDate * 1000), now);
    if (secondsRemaining <= 0) return <span>Aired</span>;

    const days = Math.floor(secondsRemaining / (24 * 3600));
    const hours = Math.floor((secondsRemaining % (24 * 3600)) / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;

    return (
        <p>
            {days > 0 && `${days}d `}
            {hours > 0 && `${hours}h `}
            {minutes > 0 && `${minutes}m `}
            {seconds}s
        </p>
    );
};

function WatchPageComponent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const firestore = useFirestore();

  const animeId = params.id as string;
  const episodeParam = searchParams.get('ep');

  const { data: aboutResponse, isLoading: isLoadingAbout } = useQuery<{data: AnimeAboutResponse} | { success: false, error: string }>({
    queryKey: ['anime', animeId],
    queryFn: () => AnimeService.getAnimeAbout(animeId),
    enabled: !!animeId,
  });

  const { data: episodesResponse, isLoading: isLoadingEpisodes } = useQuery({
    queryKey: ["anime-episodes", animeId],
    queryFn: () => AnimeService.getEpisodes(animeId),
    enabled: !!animeId,
  });

  const [lastWatchedEp, setLastWatchedEp] = useState<string | null>(null);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
  
  const episodes: AnimeEpisode[] = useMemo(() => episodesResponse && 'data' in episodesResponse ? episodesResponse.data.episodes : [], [episodesResponse]);
  const about = useMemo(() => aboutResponse && 'data' in aboutResponse ? aboutResponse.data.anime : null, [aboutResponse]);
  const seasons = useMemo(() => aboutResponse && 'data' in aboutResponse ? aboutResponse.data.seasons : [], [aboutResponse]);

  const historyRef = useMemoFirebase(() => {
    if (user && animeId && !user.isAnonymous) {
      return doc(firestore, 'users', user.uid, 'history', animeId);
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
    if (isLoadingEpisodes) return;
    
    if (episodes.length > 0 && !episodeParam) {
      const targetEpId = lastWatchedEp || extractEpisodeId(episodes[0].episodeId) || episodes[0].number;
      if (targetEpId) {
        router.replace(`/watch/${animeId}?ep=${targetEpId}`);
      }
    }
  }, [animeId, router, lastWatchedEp, episodeParam, episodes, isLoadingEpisodes]);

  const currentEpisode = useMemo(() => {
    const epNum = episodeParam || (lastWatchedEp || '1');
    return episodes.find(e => extractEpisodeId(e.episodeId) === epNum || String(e.number) === epNum) || (episodes.length > 0 ? episodes[0] : null);
  }, [episodes, episodeParam, lastWatchedEp]);
  
  const navigateEpisode = (dir: 'next' | 'prev') => {
    if (!episodes.length || !currentEpisode) return;
    const currentIndex = episodes.findIndex((ep) => ep.episodeId === currentEpisode.episodeId);
    if (currentIndex === -1) return;
    const newIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= episodes.length) return;
    const nextEpId = extractEpisodeId(episodes[newIndex].episodeId) || episodes[newIndex].number;
    router.push(`/watch/${animeId}?ep=${nextEpId}`);
  };

  const iframeSrc = `https://megaplay.buzz/stream/s-2/${currentEpisode?.episodeId}`;
  
  if (isLoadingAbout || isLoadingEpisodes) {
     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>;
  }

  if (!about || !currentEpisode) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Content Not Available</h1>
          <p className="text-muted-foreground max-w-md mt-2">
              We couldn&apos;t load the details for this anime or episode. Please try again later or go back home.
          </p>
          <Link href="/home" className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold">
              Back to Home
          </Link>
      </div>
    );
  }

  const nextAiring = about?.moreInfo?.nextAiringEpisode;

  const renderInfoSidebar = () => (
    <div className="bg-card rounded-lg p-4 border border-border/50 space-y-3">
        <div className='relative'>
            <Image src={about.info.poster} alt={about.info.name} width={300} height={450} className="rounded-lg w-full shadow-lg opacity-30 blur-sm"/>
            <Image src={about.info.poster} alt={about.info.name} width={300} height={450} className="rounded-lg w-4/5 shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
        </div>
        <h1 className="text-xl font-bold mt-4">{about.info.name}</h1>
        {about.moreInfo.otherNames && <p className="text-xs text-muted-foreground">{about.moreInfo.otherNames}</p>}
        <div className="flex items-center gap-2 flex-wrap">
            {about.info.stats.quality && <Badge variant="secondary">{about.info.stats.quality}</Badge>}
            {about.info.stats.rating && <Badge variant="secondary">{about.info.stats.rating}</Badge>}
            <Badge variant="secondary">{about.info.stats.type}</Badge>
        </div>
        <p className='text-sm text-muted-foreground line-clamp-3' dangerouslySetInnerHTML={{__html: about.info.description}}></p>
        <div className="space-y-1 text-xs border-t border-border/50 pt-3">
            {Object.entries({
                "Country": about.moreInfo.country,
                "Genres": about.moreInfo.genres?.join(', '),
                "Date aired": about.moreInfo.aired,
                "Status": about.moreInfo.status,
                "Studios": about.moreInfo.studios,
                "MAL": about.moreInfo.malscore,
            }).map(([label, value]) => (
                value && <div key={label} className="flex"><span className='w-20 font-semibold flex-shrink-0'>{label}:</span> <span className='text-muted-foreground truncate'>{value}</span></div>
            ))}
        </div>
        <div className="border-t border-border/50 pt-3">
             <h3 className="font-semibold mb-2">How'd you rate this anime?</h3>
             <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1 text-amber-400'>
                    <Star className='w-5 h-5'/>
                    <Star className='w-5 h-5'/>
                    <Star className='w-5 h-5'/>
                    <Star className='w-5 h-5'/>
                    <Star className='w-5 h-5 opacity-50'/>
                </div>
                <p className='text-xs text-muted-foreground'>6.86 by 4,636 reviews</p>
             </div>
        </div>
         <div className="border-t border-border/50 pt-3 flex items-center gap-3">
             <Image src="https://cdn.noitatnemucod.net/static/img/avatar.png" alt="avatar" width={40} height={40} />
             <div>
                <h3 className="font-semibold">Love this site?</h3>
                <p className='text-xs text-muted-foreground'>Share it and let others know!</p>
             </div>
        </div>
    </div>
  );

  return (
     <main className="min-h-screen bg-background text-foreground px-2 sm:px-4 lg:px-6 py-6 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-3 hidden lg:block sticky top-20 h-max">
                {renderInfoSidebar()}
            </div>

            <div className="lg:col-span-9 xl:col-span-6">
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5 flex-wrap">
                    <Link href="/home" className="hover:text-primary flex items-center gap-1"><Home className="w-3 h-3"/> Home</Link> &gt; 
                    <Link href={`/search?type=${about.info.stats.type}`} className="hover:text-primary">{about.info.stats.type}</Link> &gt; 
                    <span className="text-foreground font-medium truncate">{about.info.name}</span>
                </div>

                <div className="mb-4 aspect-video w-full rounded-lg overflow-hidden bg-black">
                   {currentEpisode ? (
                        <iframe
                            key={iframeSrc}
                            src={iframeSrc}
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-primary w-12 h-12" />
                        </div>
                    )}
                </div>
                
                <div className="flex justify-between items-center mb-4 flex-wrap gap-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2"><Info className="w-4 h-4" /> Anime Info</Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="p-0">
                          <ScrollArea className="h-full p-4">{renderInfoSidebar()}</ScrollArea>
                      </SheetContent>
                    </Sheet>
                    <Sheet>
                      <SheetTrigger asChild>
                         <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2"><List className="w-4 h-4" /> Episodes</Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="p-0">
                        <EpisodeList 
                          episodes={episodes} 
                          currentEpisodeId={currentEpisode.number.toString()} 
                          onEpisodeSelect={(ep) => router.push(`/watch/${animeId}?ep=${extractEpisodeId(ep.episodeId) || ep.number}`)}
                        />
                      </SheetContent>
                    </Sheet>
                  </div>
                   <div className="flex items-center gap-1 flex-wrap">
                       {[
                          {icon: SkipBack, label: "Prev", action: () => navigateEpisode('prev'), disabled: !episodes.length || (episodes.findIndex(e=>e.episodeId === currentEpisode?.episodeId) <= 0)}, 
                          {icon: SkipForward, label: "Next", action: () => navigateEpisode('next'), disabled: !episodes.length || (episodes.findIndex(e=>e.episodeId === currentEpisode?.episodeId) >= episodes.length - 1)}, 
                          {icon: Heart, label: "Bookmark"},
                          {icon: Users, label: "W2G"}, {icon: Flag, label: "Report"},
                      ].map(item => (
                          <Button key={item.label} onClick={item.action} disabled={item.disabled} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5"><item.icon className="w-4 h-4 mr-1"/> {item.label}</Button>
                      ))}
                  </div>
                </div>


                <div className="bg-card p-2 border border-border/50 rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs mb-4">
                    <div className="flex items-center gap-1 flex-wrap">
                        {[
                            {icon: Expand, label: "Expand"}, {icon: Focus, label: "Focus"}, {icon: MonitorPlay, label: "AutoNext"},
                            {icon: Play, label: "AutoPlay"}, {icon: SkipForward, label: "AutoSkip"},
                        ].map(item => (
                            <Button key={item.label} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5"><item.icon className="w-4 h-4 mr-1"/> {item.label}</Button>
                        ))}
                    </div>
                </div>

                 <div className="bg-card p-3 border border-border/50 rounded-lg mt-4">
                    <p className='font-semibold'>You are watching Episode {currentEpisode.number}</p>
                    <p className='text-xs text-muted-foreground'>If the current server is not working, please try switching to other servers.</p>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 mt-2'>
                        <div className='flex items-center gap-1 text-sm'>
                            <Button size="sm" variant={language === "sub" ? "secondary" : "ghost"} className='font-semibold' onClick={() => setLanguage("sub")}>Hard Sub</Button>
                            <Button size="sm" variant={language === "dub" ? "secondary" : "ghost"} className='font-semibold' onClick={() => setLanguage("dub")}>Soft Sub</Button>
                        </div>
                        <div className='flex items-center gap-1 text-sm'>
                            <Button size="sm" variant='destructive' className="bg-green-500 hover:bg-green-600 text-white">Server 1</Button>
                            <Button size="sm" variant='secondary'>Server 2</Button>
                        </div>
                    </div>
                 </div>

                {nextAiring && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-3 rounded-lg mt-4 flex justify-between items-center text-sm">
                        <div>
                            <p className="font-semibold">The next episode is expected to be released on {format(new Date(nextAiring.airingTime * 1000), 'yyyy/MM/dd h:mm:ss a')}</p>
                        </div>
                        <CountdownTimer targetDate={nextAiring.airingTime} />
                    </div>
                )}
                
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
                    currentEpisodeId={currentEpisode.number.toString()} 
                    onEpisodeSelect={(ep) => router.push(`/watch/${animeId}?ep=${extractEpisodeId(ep.episodeId) || ep.number}`)}
                />
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
