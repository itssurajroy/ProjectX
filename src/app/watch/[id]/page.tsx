

'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { extractEpisodeId } from '@/lib/utils';
import AdvancedMegaPlayPlayer from '@/components/player/AdvancedMegaPlayPlayer';
import EpisodeList from '@/components/watch/episode-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Download, Bug, Users, ChevronLeft, ChevronRight, Home, Tv, Star, MonitorPlay, Zap, SkipForward, ListVideo, Film } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimeBase, AnimeEpisode, AnimeAbout, EpisodeServer } from '@/types/anime';
import Link from 'next/link';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const WatchPageSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3">
                <Skeleton className="h-[600px] w-full" />
            </div>
            <div className="col-span-12 lg:col-span-6 space-y-6">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="col-span-12 lg:col-span-3">
                <Skeleton className="h-[600px] w-full" />
            </div>
        </div>
    </div>
);


const AnimeDetails = ({ anime }: { anime: AnimeAbout }) => (
    <div className="bg-card/60 backdrop-blur-md rounded-lg p-4 border border-border/50">
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

const WatchPlayer = ({ id, anime, episodes, currentEpisodeId, onNext }: { id: string, anime: AnimeAbout, episodes: AnimeEpisode[], currentEpisodeId: string | null, onNext: () => void; }) => {
    const currentEpisode = episodes.find(e => extractEpisodeId(e.episodeId) === currentEpisodeId) || episodes[0];
    
    const { data: serversResponse } = useQuery({
      queryKey: ["episode-servers", currentEpisode?.episodeId],
      queryFn: () => AnimeService.getEpisodeServers(currentEpisode.episodeId),
      enabled: !!currentEpisode?.episodeId,
    });
    
    const [currentServer, setCurrentServer] = useState<EpisodeServer | null>(null);
    const [lang, setLang] = useState<'sub' | 'dub' | 'raw'>('sub');

    useEffect(() => {
      if (serversResponse && 'data' in serversResponse) {
        const serversForLang = serversResponse.data[lang];
        if (serversForLang && serversForLang.length > 0) {
            const megaCloudServer = serversForLang.find(s => s.serverName.toLowerCase() === 'megacloud');
            setCurrentServer(megaCloudServer || serversForLang[0]);
        } else {
            // Fallback logic
            const defaultServer = 
                serversResponse.data.sub?.find(s => s.serverName.toLowerCase() === 'megacloud') ||
                serversResponse.data.sub?.[0] || 
                serversResponse.data.dub?.[0] || 
                serversResponse.data.raw?.[0];
            if (defaultServer) {
                setCurrentServer(defaultServer);
                if (serversResponse.data.sub?.[0]) setLang('sub');
                else if (serversResponse.data.dub?.[0]) setLang('dub');
                else setLang('raw');
            }
        }
      }
    }, [serversResponse, lang]);
    
    const servers = serversResponse && 'data' in serversResponse ? [...(serversResponse.data.sub || []), ...(serversResponse.data.dub || [])] : [];
    const uniqueServers = Array.from(new Map(servers.map(s => [s.serverName, s])).values());
    
    const episodeIdForPlayer = `${id}?ep=${currentEpisodeId}`;

    return (
        <div className="bg-card/60 backdrop-blur-md rounded-lg border border-border/50">
            {currentEpisodeId && currentServer ? (
                <AdvancedMegaPlayPlayer
                  episodeId={currentEpisode.episodeId}
                  server={currentServer.serverName}
                  initialLang={lang}
                  title={anime.info.name}
                  episode={String(currentEpisode.number)}
                  onNextEpisode={onNext}
                />
            ) : (
                <div className="aspect-video bg-black flex items-center justify-center rounded-t-lg">
                   <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            )}
            <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">You are watching <span className="font-bold text-foreground">Episode {currentEpisode?.number}</span>. If the current server doesn't work, please try other servers.</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        {uniqueServers.map((server) => (
                           <Button key={server.serverId} size="sm" variant={currentServer?.serverName === server.serverName ? 'default' : 'secondary'} className={currentServer?.serverName === server.serverName ? 'bg-primary hover:bg-primary/80' : ''} onClick={() => setCurrentServer(server)}>
                               {server.serverName}
                           </Button>
                        ))}
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Button size="sm" variant={lang === 'sub' ? 'destructive' : 'ghost'} onClick={() => setLang('sub')}>SUB</Button>
                        <span>|</span>
                        <Button size="sm" variant={lang === 'dub' ? 'destructive' : 'ghost'} onClick={() => setLang('dub')}>DUB</Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {[
                        {icon: Zap, label: "AutoNext"},
                        {icon: MonitorPlay, label: "AutoPlay"},
                        {icon: SkipForward, label: "AutoSkip"},
                        {icon: Heart, label: "Bookmark"},
                        {icon: Bug, label: "Report"},
                    ].map(item => (
                        <Button key={item.label} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-muted/50">
                            <item.icon className="w-4 h-4 mr-1.5"/>{item.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EpisodeSidebar = ({ episodes, currentEpisodeId, onEpisodeSelect, onPrev, onNext }: { episodes: AnimeEpisode[], currentEpisodeId: string | null, onEpisodeSelect: (ep: AnimeEpisode) => void, onPrev: () => void, onNext: () => void }) => {
    const currentIndex = episodes.findIndex(e => extractEpisodeId(e.episodeId) === currentEpisodeId);
    
    return (
        <div className="bg-card/60 backdrop-blur-md rounded-lg p-4 border border-border/50">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Episodes</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary w-8 h-8" onClick={onPrev} disabled={currentIndex <= 0}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary w-8 h-8" onClick={onNext} disabled={currentIndex >= episodes.length - 1}>
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
            <EpisodeList
                episodes={episodes}
                currentEpisodeId={currentEpisodeId || ""}
                onEpisodeSelect={onEpisodeSelect}
            />
        </div>
    );
}


export default function EliteWatchPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const episodeParam = searchParams.get("ep");

  const { data: aboutResponse, isLoading: loadingAbout } = useQuery({
    queryKey: ["anime-about", id],
    queryFn: () => AnimeService.getAnimeAbout(id),
    enabled: !!id,
  });

  const { data: episodesResponse, isLoading: loadingEpisodes } = useQuery({
    queryKey: ["anime-episodes", id],
    queryFn: () => AnimeService.getEpisodes(id),
    enabled: !!id,
  });
  
  const episodes = episodesResponse && 'data' in episodesResponse ? episodesResponse.data.episodes : [];

  useEffect(() => {
    if (!loadingEpisodes && episodes.length > 0 && !episodeParam) {
      const firstEpisodeId = extractEpisodeId(episodes[0].episodeId);
      if (firstEpisodeId) {
        router.replace(`/watch/${id}?ep=${firstEpisodeId}`);
      }
    }
  }, [loadingEpisodes, episodes, episodeParam, id, router]);
  
  const anime = aboutResponse && 'data' in aboutResponse ? aboutResponse.data.anime : null;
  const currentEpisodeId = episodeParam;

  const goToEpisode = (epId: string | null) => {
    if (epId) {
        router.push(`/watch/${id}?ep=${epId}`);
    }
  };
  
  const currentIndex = episodes.findIndex((e) => extractEpisodeId(e.episodeId) === currentEpisodeId);

  const handlePrev = () => {
    if (currentIndex > 0) goToEpisode(extractEpisodeId(episodes[currentIndex - 1].episodeId));
  };

  const handleNext = () => {
    if (currentIndex < episodes.length - 1)
      goToEpisode(extractEpisodeId(episodes[currentIndex + 1].episodeId));
  };

  const isLoading = loadingAbout || loadingEpisodes || (!episodeParam && episodes.length > 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {anime && <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${anime.info.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.3) saturate(0.8)",
          opacity: 0.8
        }}
      />}

      <div className="relative pt-24 pb-8">
        {isLoading || !anime ? (
            <WatchPageSkeleton />
        ) : (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 hidden lg:block">
                        <AnimeDetails anime={anime} />
                    </div>
                    <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 space-y-6">
                        <WatchPlayer id={id} anime={anime} episodes={episodes} currentEpisodeId={currentEpisodeId} onNext={handleNext} />
                        <div className="block lg:hidden">
                            <AnimeDetails anime={anime} />
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-3 order-3 lg:order-3">
                       <EpisodeSidebar 
                          episodes={episodes} 
                          currentEpisodeId={currentEpisodeId} 
                          onEpisodeSelect={(ep) => goToEpisode(extractEpisodeId(ep.episodeId))}
                          onPrev={handlePrev}
                          onNext={handleNext}
                       />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
