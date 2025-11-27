

// app/watch/[id]/page.tsx
"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/AnimeService";
import { extractEpisodeId } from "@/lib/utils";
import AdvancedMegaPlayPlayer from "@/components/player/AdvancedMegaPlayPlayer";
import EpisodeList from "@/components/watch/episode-list";
import CommentsSection from "@/components/watch/comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Download, Bug, Users, Shuffle, ChevronLeft, ChevronRight, Home, Tv, Film } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimeBase, AnimeEpisode } from "@/types/anime";
import Link from "next/link";
import Image from "next/image";
import PollsSection from "@/components/watch/PollsSection";

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
  
  const { anime, relatedAnimes } = aboutResponse.data;
  
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full Bleed Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${anime.info.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.3)",
        }}
      />

      {/* Main Content */}
      <div className="relative pt-8">

        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white"><Home className="w-4 h-4" /></Link>
            <span>/</span>
            <Link href="/tv" className="hover:text-white"><Tv className="w-4 h-4" /></Link>
            <span>/</span>
            <span className="text-white truncate max-w-2xl">{anime.info.name}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Sidebar: Anime Details */}
            <div className="xl:col-span-3 space-y-8 order-2 xl:order-1">
               <div className="flex flex-col gap-8 items-start">
                <div className="relative flex-shrink-0 w-full">
                  <div className="w-full rounded-lg overflow-hidden shadow-2xl border border-white/10">
                    <Image
                      src={anime.info.poster}
                      alt={anime.info.name}
                      width={256}
                      height={360}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-3xl font-black leading-tight">{anime.info.name}</h1>
                    {anime.moreInfo?.japanese && (
                      <p className="text-lg text-gray-400 mt-1">{anime.moreInfo.japanese}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge className="bg-green-600/20 text-green-400 border-green-600">SUB {episodes.length}</Badge>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-600">DUB {episodes.length}</Badge>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300">{anime.moreInfo?.status || "Ongoing"}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {anime.moreInfo?.genres?.map((g: string) => (
                      <Badge key={g} variant="outline" className="border-purple-600 text-purple-400">
                        {g}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed max-w-4xl" dangerouslySetInnerHTML={{ __html: anime.info.description || "No synopsis available."}}/>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      <Heart className="w-5 h-5 mr-2" /> Add to List
                    </Button>
                    <Button size="lg" variant="outline" className="border-gray-600">
                      <Share2 className="w-5 h-5 mr-2" /> Share
                    </Button>
                    <Button size="lg" variant="outline" className="border-gray-600">
                      <Download className="w-5 h-5 mr-2" /> Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Player + Comments */}
            <div className="xl:col-span-6 space-y-8 order-1 xl:order-2">
              <div className="relative">
                {currentEpisodeId ? (
                  <AdvancedMegaPlayPlayer
                    episodeId={currentEpisodeId}
                    lang={"sub"}
                    title={anime.info.name}
                    episode={String(currentEpisode.number)}
                    onNextEpisode={handleNext}
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center rounded-xl">
                    <p className="text-3xl font-bold">Select an episode to begin</p>
                  </div>
                )}
              </div>
               {currentEpisodeId && id && <PollsSection animeId={id} episodeId={currentEpisode?.episodeId} />}
              {currentEpisodeId && id && (
                <div className="mt-16">
                  <CommentsSection animeId={id} episodeId={currentEpisode?.episodeId} />
                </div>
              )}
            </div>

            {/* Right Sidebar: Episode List */}
            <div className="xl:col-span-3 space-y-8 order-3">
              <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Episodes</h2>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={handlePrev} disabled={currentIndex <= 0}>
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleNext} disabled={currentIndex >= episodes.length - 1}>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <EpisodeList
                  episodes={episodes}
                  currentEpisodeId={episodeParam || ""}
                  onEpisodeSelect={(ep) => goToEpisode(extractEpisodeId(ep.episodeId))}
                  loading={loadingEpisodes}
                />
              </div>
               {relatedAnimes?.length > 0 && (
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6">You Might Like</h2>
                  <div className="space-y-4">
                    {relatedAnimes.slice(0, 5).map((item: AnimeBase) => (
                      <Link
                        key={item.id}
                        href={`/watch/${item.id}`}
                        className="flex gap-4 hover:bg-white/5 rounded-lg p-3 transition-all"
                      >
                        <Image
                          src={item.poster}
                          alt={item.name}
                          width={80}
                          height={110}
                          className="rounded object-cover"
                        />
                        <div>
                          <h3 className="font-medium line-clamp-2">{item.name}</h3>
                          <div className="flex gap-2 mt-2 text-xs text-gray-400">
                            <Badge variant="secondary" className="text-xs">TV</Badge>
                            <span>{item.episodes?.sub || "?"} eps</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    