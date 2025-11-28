
'use client';
import { AnimeService } from '@/lib/AnimeService';
import { CharacterVoiceActor, AnimeInfo, AnimeAboutResponse, AnimeBase, AnimeSeason, PromotionalVideo } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { Play, Clapperboard, Users, ChevronDown, Check, Trash2, Tv, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { doc, setDoc, deleteDoc, getDoc, DocumentData, serverTimestamp, onSnapshot } from 'firebase/firestore';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

import { AnimeCard } from '@/components/AnimeCard';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type WatchlistStatus = 'Watching' | 'Plan to Watch' | 'Completed' | 'On-Hold';

const SidebarAnimeCard = ({ anime }: { anime: AnimeBase }) => (
    <Link href={`/anime/${anime.id}`} passHref>
        <div className="flex gap-4 items-center group cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="relative w-16 h-24 flex-shrink-0">
                <Image src={anime.poster} alt={anime.name} fill className="rounded-md object-cover shadow-md" />
            </div>
            <div className="overflow-hidden">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{anime.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {anime.type && <span className="flex items-center gap-1">{anime.type}</span>}
                    {anime.episodes?.sub && <span>{anime.episodes.sub} EPs</span>}
                </div>
            </div>
        </div>
    </Link>
);

const PromotionalVideosSection = ({ videos }: { videos: PromotionalVideo[] }) => {
    if (!videos || videos.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3 flex items-center gap-2"><Video /> Promotional Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((video, index) => (
                    <a key={index} href={video.source} target="_blank" rel="noopener noreferrer" className="group">
                        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                            <Image src={video.thumbnail || ''} alt={video.title || `Promo Video ${index + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <p className="text-sm font-medium mt-2 truncate text-muted-foreground group-hover:text-primary">{video.title || `Promo Video ${index + 1}`}</p>
                    </a>
                ))}
            </div>
        </section>
    );
};


const CharacterCard = ({ cv }: { cv: CharacterVoiceActor }) => (
    <div className="bg-card/50 rounded-lg overflow-hidden flex border border-border/50">
        {/* Character */}
        <div className="w-1/2 flex items-center gap-3 p-2">
            <div className="relative aspect-[2/3] w-12 flex-shrink-0">
                <Image src={cv.character.poster} alt={cv.character.name} fill className="object-cover rounded-md" />
            </div>
            <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-primary truncate">{cv.character.name}</h4>
                <p className="text-xs text-muted-foreground">{cv.character.cast}</p>
            </div>
        </div>

        {/* Voice Actor */}
        {cv.voiceActor && (
            <div className="w-1/2 flex items-center gap-3 p-2 bg-card/40 justify-end text-right">
                <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{cv.voiceActor.name}</p>
                    <p className="text-xs text-muted-foreground">{cv.voiceActor.cast}</p>
                </div>
                <div className="relative aspect-[2/3] w-12 flex-shrink-0">
                    <Image src={cv.voiceActor.poster} alt={cv.voiceActor.name} fill className="object-cover rounded-md" />
                </div>
            </div>
        )}
    </div>
);


const SeasonsSection = ({ seasons, currentAnimeId }: { seasons: AnimeSeason[], currentAnimeId: string }) => {
    if (!seasons || seasons.length <= 1) return null;

    return (
        <section>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3 flex items-center gap-2"><Tv /> More Seasons</h2>
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                <div className="flex space-x-4 pb-4">
                    {seasons.map((season) => (
                         <div key={season.id} className="w-40 flex-shrink-0">
                            <AnimeCard anime={{
                                id: season.id,
                                name: season.title,
                                poster: season.poster,
                            }} />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
    );
};


function AnimeDetailsPageClient({ id }: { id: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [watchlistStatus, setWatchlistStatus] = useState<WatchlistStatus | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const watchlistOptions: WatchlistStatus[] = ['Watching', 'Plan to Watch', 'Completed', 'On-Hold'];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery<{data: AnimeAboutResponse} | { success: false; error: string }>({
    queryKey: ['anime', id],
    queryFn: () => AnimeService.getAnimeAbout(id),
  });
  
  const animeResult = apiResponse && !('success' in apiResponse) ? apiResponse.data : null;
  const anime = animeResult?.anime;
  const seasons = animeResult?.seasons;
  const animeInfo: AnimeInfo | undefined = anime?.info;
  const moreInfo = anime?.moreInfo;
  const recommendedAnimes = animeResult?.recommendedAnimes;
  const relatedAnimes = animeResult?.relatedAnimes;
  const characters: CharacterVoiceActor[] = animeInfo?.characterVoiceActors ?? [];
  const promotionalVideos: PromotionalVideo[] = animeInfo?.promotionalVideos ?? [];


  const { data: episodesResult } = useQuery<any | { success: false, error: string }>({
    queryKey: ['episodes', id],
    queryFn: () => AnimeService.getEpisodes(id),
    enabled: !!animeInfo
  });

  const episodes = episodesResult && !('success' in episodesResult) ? episodesResult.data?.episodes : [];

  const watchlistDocRef = useMemoFirebase(() => {
    if(!user || !animeInfo || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'bookmarks', animeInfo.id);
  }, [user, animeInfo, firestore])

  useEffect(() => {
    if (!watchlistDocRef) {
        setWatchlistStatus(null);
        return;
    }
    const unsub = onSnapshot(watchlistDocRef, (docSnap) => {
        if (docSnap.exists()) {
            setWatchlistStatus(docSnap.data()?.status || 'Watching');
        } else {
            setWatchlistStatus(null);
        }
    });

    return () => unsub();
  }, [watchlistDocRef]);
  
  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error loading anime details: {(error as Error)?.message || 'Anime not found.'}</div>;
  if (!animeInfo || !moreInfo) return <div className="flex justify-center items-center h-screen">Error loading anime details or anime not found.</div>;

  
  const handleWatchlistChange = (newStatus: WatchlistStatus | null) => {
    if (!watchlistDocRef) return;

    setIsDropdownOpen(false);

    if (newStatus === null) {
      // Remove from watchlist
      deleteDocumentNonBlocking(watchlistDocRef);
      setWatchlistStatus(null);
    } else {
      // Add or update watchlist
      const watchlistData: DocumentData = {
        id: animeInfo.id,
        name: animeInfo.name,
        poster: animeInfo.poster,
        type: animeInfo.stats.type,
        status: newStatus,
        updatedAt: serverTimestamp(),
      };
      // Add bookmarkedAt only when first adding
      if (!watchlistStatus) {
        watchlistData.bookmarkedAt = serverTimestamp();
      }

      setDocumentNonBlocking(watchlistDocRef, watchlistData, { merge: true });
      setWatchlistStatus(newStatus);
    }
  };
  
  const firstEpisodeId = episodes && episodes.length > 0 && episodes[0]?.episodeId ? episodes[0].episodeId : null;


  const stats = animeInfo.stats;
  
  return (
    <div className="min-h-screen bg-background text-foreground">
        <div className="relative h-auto md:h-auto overflow-hidden">
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

          <div className="px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-20 md:py-28">
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <Image
                src={animeInfo.poster}
                alt={animeInfo.name}
                width={250}
                height={380}
                className="rounded-lg shadow-2xl shadow-black/50 w-48 md:w-[250px] object-cover transition-all duration-300 hover:scale-105"
                priority
              />
            </div>
            
            <div className="lg:col-span-9 flex flex-col justify-center h-full text-center lg:text-left">
              <div className="text-sm text-muted-foreground hidden sm:block">Home &gt; {stats.type} &gt; {animeInfo.name}</div>
              <h1 className="text-3xl md:text-5xl font-bold mt-2 text-glow">{animeInfo.name}</h1>
              
              <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 text-sm text-muted-foreground mt-4">
                  {stats.rating && <span className="px-2 py-1 bg-card/50 rounded-md border border-border/50">⭐ {stats.rating}</span>}
                  <span className="px-2 py-1 bg-card/50 rounded-md border border-border/50">{stats.quality}</span>
                  {stats.episodes.sub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-card/50 rounded-md border border-border/50">
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

              <p className="text-muted-foreground leading-relaxed mt-6 max-w-3xl text-sm line-clamp-3 mx-auto lg:mx-0" dangerouslySetInnerHTML={{ __html: animeInfo.description }}></p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
                {firstEpisodeId && (
                  <Link href={`/watch/${animeInfo.id}?ep=${firstEpisodeId}`} className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/20">
                    <Play /> Watch Now
                  </Link>
                )}
                 {isClient && user && (
                    <div className="relative">
                        <button 
                            onClick={() => user && setIsDropdownOpen(!isDropdownOpen)} 
                            disabled={!user} 
                            className="flex items-center justify-center gap-2 bg-card text-card-foreground px-6 py-3 rounded-lg font-semibold hover:bg-card/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-border w-full sm:w-auto"
                        >
                           {watchlistStatus ? <><Check className="text-primary"/> {watchlistStatus}</> : <>+ Add to List</>}
                           <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDropdownOpen && (
                            <div 
                                onMouseLeave={() => setIsDropdownOpen(false)}
                                className="absolute top-full mt-2 w-48 bg-card rounded-lg shadow-xl py-1 z-20 border border-border animate-in fade-in-0 zoom-in-95"
                            >
                                {watchlistOptions.map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => handleWatchlistChange(status)} 
                                        className={cn("w-full text-left px-4 py-2 text-sm flex items-center justify-between", watchlistStatus === status ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50')}
                                    >
                                        {status}
                                        {watchlistStatus === status && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                                {watchlistStatus && (
                                  <>
                                    <div className="h-px bg-border my-1" />
                                    <button 
                                        onClick={() => handleWatchlistChange(null)}
                                        className="w-full text-left px-4 py-2 text-sm text-destructive flex items-center gap-2 hover:bg-destructive/10"
                                    >
                                      <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                  </>
                                )}
                            </div>
                        )}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

      <main className="px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 bg-card p-4 rounded-lg border border-border self-start">
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
                                        <Link key={genre} href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-md hover:text-primary hover:bg-muted">{genre}</Link>
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
              {seasons && <SeasonsSection seasons={seasons} currentAnimeId={id} />}
              
              {characters.length > 0 && (
                <section>
                   <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3 flex items-center gap-2"><Users /> Characters & Voice Actors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {characters.slice(0, 10).map(cv => (
                            <CharacterCard key={cv.character.id} cv={cv} />
                        ))}
                    </div>
                </section>
              )}

              {promotionalVideos.length > 0 && <PromotionalVideosSection videos={promotionalVideos} />}

             {recommendedAnimes && recommendedAnimes.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3">✨ Recommended for you</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {recommendedAnimes?.slice(0,10).map((rec: AnimeBase) => (
                        <AnimeCard key={rec.id} anime={rec} />
                    ))}
                    </div>
                </section>
             )}
          </div>
          <div className="lg:col-span-3 space-y-6">
            {relatedAnimes && relatedAnimes.length > 0 && (
                <div className='bg-card p-4 rounded-lg border border-border'>
                    <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">🔀 Related Anime</h2>
                    <div className="flex flex-col gap-2">
                    {relatedAnimes?.slice(0, 7).map((rec: AnimeBase) => (
                        <SidebarAnimeCard key={rec.id} anime={rec} />
                    ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AnimeDetailsPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params);
  return <AnimeDetailsPageClient id={id} />;
}

    