
'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { QtipAnime } from "@/types/anime";
import { useQuery } from "@tanstack/react-query";
import { Star, Tv, Clapperboard } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { AnimeService } from "@/lib/AnimeService";
import { useState } from "react";

const TooltipSkeleton = () => (
    <div className="p-2 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
        </div>
    </div>
)

export function AnimeTooltip({ animeId, children }: { animeId: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: qtipResult, isLoading } = useQuery<{anime: QtipAnime}>({
    queryKey: ['qtip', animeId],
    queryFn: () => AnimeService.qtip(animeId),
    enabled: isOpen, // Only fetch when the tooltip is opened
    staleTime: Infinity, // Cache forever
    refetchOnWindowFocus: false,
  });
  
  const anime = qtipResult?.anime;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right" className="w-80 bg-card border-border shadow-lg p-0">
          {isLoading || !anime ? (
            <TooltipSkeleton />
          ) : (
            <div className="p-3 space-y-3">
                <h3 className="font-bold text-base text-primary">{anime.name}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {anime.malscore && <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {anime.malscore}</div>}
                    <div className="flex items-center gap-1"><Tv className="w-3 h-3"/> {anime.type}</div>
                    {anime.episodes?.sub && <div className="flex items-center gap-1"><Clapperboard className="w-3 h-3"/> {anime.episodes.sub}</div>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-4" dangerouslySetInnerHTML={{__html: anime.description}} />
                
                <div className="text-xs space-y-1 text-muted-foreground">
                    <p><span className="font-bold text-foreground">Aired:</span> {anime.aired}</p>
                    <p><span className="font-bold text-foreground">Status:</span> {anime.status}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                    {anime.genres?.slice(0, 4).map(genre => (
                        <Badge key={genre} variant="secondary" className="text-xs">{genre}</Badge>
                    ))}
                </div>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
