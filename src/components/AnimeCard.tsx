
import { AnimeBase } from "@/types/anime"
import Link from "next/link"
import { AnimeTooltip } from "./AnimeTooltip"
import { Clapperboard, Mic, Play, Clock } from "lucide-react"
import { CldImage } from "next-cloudinary"

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
        
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-card shadow-md transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary)_/_0.3)] group-hover:-translate-y-1 border-2 border-transparent group-hover:border-primary/50">
          
          {rank && (
            <div className="absolute top-0 left-0 z-20 bg-gradient-to-br from-primary to-accent px-3 py-1 rounded-br-lg text-white font-black text-lg shadow-lg">
              {rank < 10 ? `0${rank}` : rank}
            </div>
          )}

          <CldImage
            src={anime.poster}
            alt={anime.name}
            width={400}
            height={600}
            crop="fill"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-90" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                <Play className="w-6 h-6 text-white fill-white" />
             </div>
          </div>

          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
             {isAdult && (
                <span className="bg-destructive/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-destructive/50 shadow-sm">
                   18+
                </span>
             )}
          </div>
        </div>

        <div className="mt-2 px-1 space-y-1">
          <h3 className="font-bold text-sm leading-tight text-foreground truncate group-hover:text-primary transition-colors duration-300">
            {anime.name}
          </h3>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-gray-400 transition-colors">
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
            
            <div className="flex flex-wrap items-center gap-1.5">
              {anime.episodes?.sub && (
                  <div className="flex items-center gap-1 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <Clapperboard className="w-3 h-3" />
                    {anime.episodes.sub}
                  </div>
              )}
              
              {anime.episodes?.dub && (
                  <div className="flex items-center gap-1 bg-green-600/20 border border-green-400/30 text-green-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <Mic className="w-3 h-3" />
                    {anime.episodes.dub}
                  </div>
              )}
              
              {!anime.episodes?.sub && !anime.episodes?.dub && anime.totalEpisodes && (
                  <div className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded border border-border">
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
