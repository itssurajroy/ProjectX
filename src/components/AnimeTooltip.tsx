
'use client';

import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/AnimeService";
import { QtipAnime } from "@/types/anime";
import { Badge } from "./ui/badge";
import { Star, Clapperboard } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface AnimeTooltipProps {
  animeId: string;
}

const TooltipSkeleton = () => (
    <div className="p-2 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-wrap gap-1 pt-2">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-5 w-12 rounded-full" />)}
        </div>
    </div>
);


export function AnimeTooltip({ animeId }: AnimeTooltipProps) {
  const { data: qtipResult, isLoading, isError } = useQuery<{ data: { anime: QtipAnime } } | { success: false; error: string; status?: number }>({
    queryKey: ['qtip', animeId],
    queryFn: () => AnimeService.getAnimeQtip(animeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  if (isLoading) {
    return <TooltipSkeleton />;
  }

  if (isError || !qtipResult || !qtipResult.success) {
    const status = qtipResult && 'status' in qtipResult ? qtipResult.status : null;
    if (status === 404) {
      return <div className="p-2 text-xs text-muted-foreground">No details available for this item.</div>;
    }
    return <div className="p-2 text-sm text-destructive">Could not load details for {animeId}.</div>;
  }
  
  const anime = qtipResult.data.anime;

  return (
    <div className="p-2 text-sm text-foreground">
      <h3 className="font-bold text-base text-primary mb-2">{anime.name}</h3>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        {anime.malscore && (
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5" />
            <span>{anime.malscore}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clapperboard className="w-3.5 h-3.5" />
          <span>{anime.type}</span>
        </div>
        {anime.episodes.sub > 0 && <span>EP {anime.episodes.sub}</span>}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-4 mb-3" dangerouslySetInnerHTML={{ __html: anime.description }}></p>
      
      <div className="space-y-1 text-xs mb-3">
        <p><span className="font-semibold text-foreground/80">Aired:</span> {anime.aired}</p>
        <p><span className="font-semibold text-foreground/80">Status:</span> {anime.status}</p>
      </div>

      {anime.genres && anime.genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {anime.genres.slice(0, 5).map(genre => (
            <Badge key={genre} variant="secondary" className="text-xs">{genre}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
