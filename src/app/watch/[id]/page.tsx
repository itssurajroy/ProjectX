'use client';
import { notFound, useParams, useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/watch/video-player";
import EpisodeList from "@/components/watch/episode-list";
import CommentsSection from "@/components/watch/comments";
import { Badge } from "@/components/ui/badge";
import { AnimeCard } from "@/components/AnimeCard";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/AnimeService";
import { AnimeAboutResponse, AnimeEpisode } from "@/types/anime";
import { useEffect, useState } from "react";
import PollsSection from "@/components/watch/PollsSection";
import { useRouter } from "next/navigation";

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const episodeParam = searchParams.get('ep');

  const { data: aboutResponse, isLoading: isLoadingAbout } = useQuery<{ data: AnimeAboutResponse } | { success: false; error: string }>({
    queryKey: ['animeAbout', id],
    queryFn: () => AnimeService.getAnimeAbout(id),
    enabled: !!id,
  });

  const { data: episodesResponse, isLoading: isLoadingEpisodes } = useQuery<{ data: { episodes: AnimeEpisode[] } } | { success: false; error: string }>({
    queryKey: ['animeEpisodes', id],
    queryFn: () => AnimeService.getEpisodes(id),
    enabled: !!id,
  });
  
  useEffect(() => {
    if (!isLoadingEpisodes && episodesResponse && 'data' in episodesResponse) {
      const episodes = episodesResponse.data.episodes;
      if (!episodeParam && episodes.length > 0) {
        // Redirect to the first episode if 'ep' is not in URL
        router.replace(`/watch/${id}?ep=${episodes[0].episodeId}`);
      }
    }
  }, [isLoadingEpisodes, episodesResponse, episodeParam, id, router]);

  if (isLoadingAbout || isLoadingEpisodes) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  }
  
  if (!aboutResponse || ('success' in aboutResponse) || !aboutResponse.data) {
    notFound();
  }

  const { anime, relatedAnimes } = aboutResponse.data;
  const episodes = (episodesResponse && 'data' in episodesResponse) ? episodesResponse.data.episodes : [];
  
  const currentEpisode = episodes.find(e => e.episodeId === episodeParam) || episodes[0];

  const handleEpisodeSelect = (episode: AnimeEpisode) => {
    router.push(`/watch/${id}?ep=${episode.episodeId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer anime={anime} episode={currentEpisode} />
          <div className="mt-6">
            <h1 className="text-3xl font-bold font-headline">{anime.info.name}</h1>
             {currentEpisode && <p className="text-lg text-muted-foreground mt-1">Episode {currentEpisode.number}: {currentEpisode.title}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
                {anime.moreInfo?.genres?.map((genre: string) => <Badge key={genre} variant="secondary">{genre}</Badge>)}
            </div>
            <p className="mt-4 text-muted-foreground" dangerouslySetInnerHTML={{ __html: anime.info.description }}></p>
          </div>
          <div className="mt-8">
            <PollsSection animeId={id} episodeId={currentEpisode?.episodeId} />
          </div>
          <div className="mt-8">
            <CommentsSection animeId={id} episodeId={currentEpisode?.episodeId} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <EpisodeList 
            anime={anime}
            episodes={episodes}
            currentEpisodeId={currentEpisode?.episodeId}
            onEpisodeSelect={handleEpisodeSelect}
          />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Shows</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedAnimes.slice(0,5).map((item) => (
            <AnimeCard key={item.id} anime={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
