
'use client';
import { notFound, useParams } from "next/navigation";
import VideoPlayer from "@/components/watch/video-player";
import EpisodeList from "@/components/watch/episode-list";
import Comments from "@/components/watch/comments";
import { Badge } from "@/components/ui/badge";
import MediaCard from "@/components/media/media-card";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/AnimeService";
import { AnimeAboutResponse, AnimeEpisode } from "@/types/anime";
import { useState } from "react";

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  const [selectedEpisode, setSelectedEpisode] = useState<AnimeEpisode | null>(null);

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

  if (isLoadingAbout || isLoadingEpisodes) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  }
  
  if (!aboutResponse || (aboutResponse && 'success' in aboutResponse && !aboutResponse.success) || !('data' in aboutResponse)) {
    notFound();
  }

  const { anime, relatedAnimes } = aboutResponse.data;
  const episodes = (episodesResponse && 'data' in episodesResponse) ? episodesResponse.data.episodes : [];

  const handleEpisodeSelect = (episode: AnimeEpisode) => {
    setSelectedEpisode(episode);
  };
  
  const currentEpisode = selectedEpisode || episodes[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer anime={anime} episode={currentEpisode} />
          <div className="mt-6">
            <h1 className="text-3xl font-bold font-headline">{anime.info.name}</h1>
             {currentEpisode && <p className="text-lg text-muted-foreground mt-1">{currentEpisode.title}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
                {anime.moreInfo?.genres?.map((genre: string) => <Badge key={genre} variant="secondary">{genre}</Badge>)}
            </div>
            <p className="mt-4 text-muted-foreground" dangerouslySetInnerHTML={{ __html: anime.info.description }}></p>
          </div>
          <div className="mt-8">
            <Comments />
          </div>
        </div>
        <div className="lg:col-span-1">
          <EpisodeList 
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
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
