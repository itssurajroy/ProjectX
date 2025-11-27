
// app/watch/[id]/page.tsx
"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/AnimeService";
import { extractEpisodeId } from "@/lib/utils";
import AdvancedMegaPlayPlayer from "@/components/player/AdvancedMegaPlayPlayer";
import EpisodeList from "@/components/watch/episode-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Download, Bug, Users, Shuffle, ChevronLeft, ChevronRight, Home, Tv, Star, Expand, Focus, Zap, MonitorPlay, SkipForward, ChevronDown, ListVideo } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimeBase, AnimeEpisode } from "@/types/anime";
import Link from "next/link";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  if (loadingAbout || loadingEpisodes || (!episodeParam && episodes.length > 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-2xl">Loading masterpiece...</div>
      </div>
    );
  }
  
  if (!aboutResponse || !('data' in aboutResponse) || !aboutResponse.data.anime) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Anime not found
      </div>
    );
  }
  
  const { anime, relatedAnimes, seasons } = aboutResponse.data;
  
  const currentEpisode =
    episodes.find((e) => extractEpisodeId(e.episodeId) === episodeParam) || episodes[0];
  const currentEpisodeId = currentEpisode ? extractEpisodeId(currentEpisode.episodeId) : null;
  const currentIndex = episodes.findIndex((e) => e.episodeId === currentEpisode.episodeId);

  const goToEpisode = (epId: string | null) => {
    if(epId) {
        router.push(`/watch/${id}?ep=${epId}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) goToEpisode(extractEpisodeId(episodes[currentIndex - 1].episodeId));
  };

  const handleNext = () => {
    if (currentIndex < episodes.length - 1)
      goToEpisode(extractEpisodeId(episodes[currentIndex + 1].episodeId));
  };

  const infoStats = [
    { label: 'Country', value: anime.moreInfo.country },
    { label: 'Genres', value: anime.moreInfo.genres?.join(', ') },
    { label: 'Premiered', value: anime.moreInfo.premiered },
    { label: 'Date aired', value: anime.moreInfo.aired },
    { label: 'Broadcast', value: anime.moreInfo.broadcast },
    { label: 'Episodes', value: episodes.length },
    { label: 'Duration', value: anime.info.stats.duration },
    { label: 'Status', value: anime.moreInfo.status },
    { label: 'MAL', value: anime.moreInfo.malscore },
    { label: 'Studios', value: anime.moreInfo.studios },
    { label: 'Producers', value: anime.moreInfo.producers?.join(', ') },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Full Bleed Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${anime.info.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.3) saturate(0.8)",
          opacity: 0.8
        }}
      />

      {/* Main Content */}
      <div className="relative pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Sidebar: Anime Details */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
                <div className="bg-card/60 backdrop-blur-md rounded-lg p-4 border border-border/50">
                    <Image src={anime.info.poster} alt={anime.info.name} width={300} height={450} className="rounded-lg w-full shadow-lg"/>
                    <h1 className="text-xl font-bold mt-4">{anime.info.name}</h1>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-1"  dangerouslySetInnerHTML={{ __html: anime.info.description || "No synopsis available."}}/>
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                        <Badge>PG-13</Badge>
                        <Badge variant="secondary">CC</Badge>
                        <Badge variant="secondary">HD</Badge>
                        <Badge variant="secondary">TV</Badge>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                        {infoStats.map(stat => (
                            stat.value && <div key={stat.label} className="flex justify-between">
                                <span className="font-semibold text-foreground/80">{stat.label}:</span>
                                <span className="text-muted-foreground text-right">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card/60 backdrop-blur-md rounded-lg p-4 border border-border/50">
                    <h3 className="font-bold mb-2">How'd you rate this anime?</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-bold">9.8</p>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-primary' : 'text-muted-foreground'}`}/>)}
                        </div>
                        <p className="text-xs text-muted-foreground">by 210 reviews</p>
                    </div>
                </div>
                 <div className="bg-card/60 backdrop-blur-md rounded-lg p-4 border border-border/50 flex items-center gap-4">
                     <Image src="https://placehold.co/50x50/1a1a1a/ffffff?text=X" alt="logo" width={50} height={50} className="rounded-full"/>
                     <div>
                        <h3 className="font-bold">Love this site?</h3>
                        <p className="text-sm text-muted-foreground">Share it and let others know!</p>
                     </div>
                 </div>
            </div>

            {/* Center: Player + Comments */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="bg-card/60 backdrop-blur-md rounded-lg p-1 border border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
                    <Link href="/" className="hover:text-primary"><Home className="w-4 h-4" /></Link>
                    <span>/</span>
                    <Link href="/tv" className="hover:text-primary">TV</Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-sm">{anime.info.name}</span>
                  </div>
                {currentEpisodeId ? (
                  <AdvancedMegaPlayPlayer
                    episodeId={currentEpisodeId}
                    initialLang="sub"
                    title={anime.info.name}
                    episode={String(currentEpisode.number)}
                  />
                ) : (
                  <div className="aspect-video bg-black flex items-center justify-center rounded-md">
                    <p className="text-lg font-semibold">Select an episode to begin</p>
                  </div>
                )}
                 <div className="p-4 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            {[
                                {icon: Expand, label: "Expand"},
                                {icon: Focus, label: "Focus"},
                                {icon: Zap, label: "AutoNext"},
                                {icon: MonitorPlay, label: "AutoPlay"},
                                {icon: SkipForward, label: "AutoSkip"},
                                {icon: ChevronLeft, label: "Prev"},
                                {icon: ChevronRight, label: "Next"},
                                {icon: Heart, label: "Bookmark"},
                                {icon: Users, label: "W2G"},
                                {icon: Bug, label: "Report"},
                            ].map(item => (
                                <Button key={item.label} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-muted/50">
                                    <item.icon className="w-4 h-4 mr-1.5"/>{item.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                     <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                        <p><span className="font-bold">You are watching Episode {currentEpisode.number}.</span> If the current server is not working, please try switching to other servers.</p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Badge variant="destructive" className="border-0">Hard Sub</Badge>
                                <span>Soft Sub</span>
                                <span>Dub</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-primary hover:bg-primary/80">Server 1</Button>
                                <Button size="sm" variant="secondary">Server 2</Button>
                            </div>
                        </div>
                     </div>
                     <div className="bg-green-500/10 text-green-300 border border-green-500/20 p-3 rounded-lg text-sm">
                        The next episode is expected to be released on 2025/12/02 @ 3:30 PM. (4 days, 20 hours, 58 minutes, 54 seconds)
                     </div>
                     
                     {seasons && seasons.length > 0 && (
                        <div>
                             <h3 className="text-lg font-bold mb-2">Seasons</h3>
                            <div className="flex items-center gap-2">
                                {seasons.map(season => (
                                    <Link key={season.id} href={`/anime/${season.id}`}>
                                        <Button variant={season.id === id ? 'default' : 'secondary'} className="flex items-center gap-2">
                                            {season.name} <ListVideo className="w-4 h-4"/>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                     )}
                 </div>
              </div>
            </div>

            {/* Right Sidebar: Episode List */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-card/60 backdrop-blur-md rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Episodes</h2>
                  <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Find</Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary w-6 h-6"><i className="text-xs">CC</i></Button>
                  </div>
                </div>
                <EpisodeList
                  episodes={episodes}
                  currentEpisodeId={episodeParam || ""}
                  onEpisodeSelect={(ep) => goToEpisode(extractEpisodeId(ep.episodeId))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
