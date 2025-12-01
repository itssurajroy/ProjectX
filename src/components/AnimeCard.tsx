
import { AnimeBase, QtipAnime } from "@/types/anime"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "./ui/badge"
import { AnimeTooltip } from "./AnimeTooltip"
import { Clapperboard, Tv } from "lucide-react"

type AnimeCardProps = {
  anime: AnimeBase;
  qtip?: QtipAnime;
}

export function AnimeCard({ anime, qtip }: AnimeCardProps) {
  return (
    <AnimeTooltip anime={qtip}>
      <Link href={`/anime/${anime.id}`} className="group block h-full">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-secondary">
          <Image
            src={anime.poster}
            alt={anime.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute top-2 left-2">
            {anime.rating === 'R' && <Badge variant="destructive" className="bg-red-700/90 text-white text-xs">18+</Badge>}
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
             {anime.episodes?.sub && <Badge variant="secondary" className="bg-black/70 border border-white/20 text-white text-xs gap-1"><Clapperboard className="w-3 h-3 text-primary"/> {anime.episodes.sub}</Badge>}
             {anime.episodes?.dub && <Badge variant="secondary" className="bg-black/70 border border-white/20 text-white text-xs">{anime.episodes.dub}</Badge>}
          </div>
        </div>
        <div className="mt-2">
            <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{anime.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                {anime.type && <span>{anime.type}</span>}
                {anime.type && anime.duration && <span>&bull;</span>}
                {anime.duration && <span>{anime.duration}</span>}
            </div>
        </div>
      </Link>
    </AnimeTooltip>
  )
}
