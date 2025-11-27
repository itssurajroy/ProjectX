
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
import { Heart, Share2, Download, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimeBase, AnimeEpisode } from "@/types/anime";
import Link from "next/link";
import Image from "next/image";
import PollsSection from "@/components/watch/PollsSection";

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const episodeParam = searchParams.get("ep");

  const [language, setLanguage] = useState<"sub" | "dub">("sub");

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
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="text-xl">Loading episode...</div>
      </div>
    );
  }
  
  if (!aboutResponse || !('data' in aboutResponse) || !aboutResponse.data.anime) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
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
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {currentEpisodeId ? (
          <AdvancedMegaPlayPlayer
            episodeId={currentEpisodeId}
            lang={language}
            title={anime.info.name}
            episode={String(currentEpisode.number)}
            onNextEpisode={handleNext}
          />
        ) : (
          <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
            <p className="text-gray-500 text-lg">Select an episode to start watching</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-glow">{anime.info.name}</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Episode {currentEpisode.number}
                {currentEpisode.title && `: ${currentEpisode.title}`}
              </p>
            </div>
            <div className="flex gap-2 backdrop-blur-md bg-card rounded-lg p-1 mt-4 md:mt-0">
                <Button
                size="sm"
                variant={language === "sub" ? "default" : "ghost"}
                className={language === "sub" ? "bg-primary hover:bg-primary/90" : "hover:bg-muted"}
                onClick={() => setLanguage("sub")}
                >
                SUB
                </Button>
                <Button
                size="sm"
                variant={language === "dub" ? "default" : "ghost"}
                className={language === "dub" ? "bg-primary hover:bg-primary/90" : "hover:bg-muted"}
                onClick={() => setLanguage("dub")}
                >
                DUB
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side – Info + Comments */}
          <div className="lg:col-span-3 space-y-8">
            <PollsSection animeId={id} episodeId={currentEpisode.episodeId} />

            {/* Synopsis */}
            <div
              className="prose prose-invert max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: anime.info.description }}
            />

             {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {anime.moreInfo?.genres?.map((g: string) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                >
                  {g}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Heart className="w-5 h-5 mr-2" />
                Add to Favorites
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-muted">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-muted">
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-muted">
                <Info className="w-5 h-5 mr-2" />
                Report
              </Button>
            </div>

            {/* Comments */}
            <div className="mt-12">
              <CommentsSection animeId={id} episodeId={currentEpisode?.episodeId} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:sticky top-24 self-start">
            {/* Episode List */}
            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Episodes</h2>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={handlePrev} disabled={currentIndex <= 0}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleNext}
                    disabled={currentIndex >= episodes.length - 1}
                  >
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

            {/* Recommendations */}
            {relatedAnimes && relatedAnimes.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 md:p-6">
                <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
                <div className="space-y-4">
                  {relatedAnimes.slice(0, 5).map((item: AnimeBase) => (
                    <Link
                      key={item.id}
                      href={`/anime/${item.id}`}
                      className="flex gap-3 hover:bg-muted/50 rounded-lg p-2 transition-colors group"
                    >
                      <div className="relative w-16 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.poster}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.type}
                          {item.episodes?.sub && ` • ${item.episodes.sub} eps`}
                        </p>
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
  );
}

    
