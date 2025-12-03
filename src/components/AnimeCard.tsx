
import { AnimeBase } from "@/types/anime"
import Image from "next/image"
import Link from "next/link"
import { AnimeTooltip } from "./AnimeTooltip"
import { Clapperboard, Mic, Play, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type AnimeCardProps = {
  anime: AnimeBase;
  rank?: number;
  variant?: "portrait" | "landscape";
}

export function AnimeCard({ anime, rank }: AnimeCardProps) {
  const isAdult = anime.rating === 'R' || anime.rating === 'R+' || anime.rating === 'Rx';
  
  return (
    <AnimeTooltip animeId={anime.id}>
      <Link href={`/anime/${anime.id}`} className="group relative block w-full h-full">
        
        {/* --- Card Container --- */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-900 shadow-md transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary)_/_0.3)] group-hover:-translate-y-1">
          
          {/* Rank Badge (Conditional) */}
          {rank && (
            <div className="absolute top-0 left-0 z-20 bg-gradient-to-br from-primary to-blue-600 px-3 py-1 rounded-br-xl text-white font-black text-lg shadow-lg">
              {rank < 10 ? `0${rank}` : rank}
            </div>
          )}

          {/* Poster Image */}
          <Image
            src={anime.poster}
            alt={anime.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />

          {/* Gradient Overlay (Always visible for text contrast, deeper on hover) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 opacity-60 group-hover:opacity-70" />

          {/* --- Hover Play Button --- */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                <Play className="w-8 h-8 text-white fill-white" />
             </div>
          </div>

          {/* Top Right Badges (18+ / Quality) */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
             {isAdult && (
                <span className="bg-red-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-500/50 shadow-sm">
                   18+
                </span>
             )}
          </div>
        </div>

        {/* --- Title & Meta (Below Card) --- */}
        <div className="mt-3 px-1 space-y-1">
          <h3 className="font-bold text-sm leading-tight text-gray-100 truncate group-hover:text-primary transition-colors duration-300">
            {anime.name}
          </h3>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
              {anime.type && (
                  <span className="capitalize">{anime.type}</span>
              )}
              
              {anime.duration && (
                  <>
                      <span className="w-0.5 h-0.5 bg-gray-600 rounded-full" />
                      <span className="flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         {anime.duration}
                      </span>
                  </>
              )}
            </div>
            
            {/* Sub / Dub / Ep Count Row */}
            <div className="flex flex-wrap items-center gap-1.5">
              {anime.episodes?.sub && (
                  <div className="flex items-center gap-1 bg-primary/80 backdrop-blur-sm border border-primary/50 text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <Clapperboard className="w-3 h-3" />
                    {anime.episodes.sub}
                  </div>
              )}
              
              {anime.episodes?.dub && (
                  <div className="flex items-center gap-1 bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <Mic className="w-3 h-3" />
                    {anime.episodes.dub}
                  </div>
              )}
              
              {/* Fallback if no specific sub/dub data, show total */}
              {!anime.episodes?.sub && !anime.episodes?.dub && anime.totalEpisodes && (
                  <div className="bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-medium px-2 py-0.5 rounded border border-white/10">
                    Ep {anime.totalEpisodes}
                  </div>
              )}
            </div>
          </div>
        </div>

      </Link>
    </AnimeTooltip>
  )
}
