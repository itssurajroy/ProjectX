
import { ScrollArea } from "../ui/scroll-area";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimeEpisode } from "@/types/anime";
import Image from 'next/image';

interface EpisodeListProps {
    episodes: AnimeEpisode[];
    currentEpisodeId: string | undefined;
    onEpisodeSelect: (episode: AnimeEpisode) => void;
}

export default function EpisodeList({ episodes, currentEpisodeId, onEpisodeSelect }: EpisodeListProps) {
  if (!episodes || episodes.length === 0) {
    return (
        <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Episodes</h2>
            </div>
            <div className="p-4 text-center text-muted-foreground">No episodes available.</div>
        </div>
    )
  }
  
  return (
    <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Episodes ({episodes.length})</h2>
        </div>
      <ScrollArea className="h-[600px]">
        <div className="p-2 space-y-2">
          {episodes.map((ep, index) => (
            <div
              key={ep.episodeId}
              onClick={() => onEpisodeSelect(ep)}
              className={cn(
                "flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-secondary",
                currentEpisodeId === ep.episodeId && "bg-secondary"
              )}
            >
              <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={`https://img.anili.st/media/${ep.episodeId}`}
                  alt={ep.title}
                  fill
                  className="object-cover"
                  onError={(e) => e.currentTarget.src = "https://picsum.photos/seed/placeholder/320/180"}
                />
                 {currentEpisodeId === ep.episodeId && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white"/>
                    </div>
                 )}
              </div>
              <div className="flex-grow overflow-hidden">
                <h3 className="font-semibold text-sm truncate">{ep.title}</h3>
                <p className="text-xs text-muted-foreground">Episode {ep.number}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
