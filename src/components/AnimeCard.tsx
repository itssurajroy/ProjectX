
import { AnimeBase, QtipAnime } from "@/types/anime"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "./ui/badge"
import { PlayCircle } from "lucide-react"
import { AnimeTooltip } from "./AnimeTooltip"

type AnimeCardProps = {
  anime: AnimeBase;
  qtip?: QtipAnime;
}

export function AnimeCard({ anime, qtip }: AnimeCardProps) {
  return (
    <AnimeTooltip anime={qtip}>
      <Link href={`/anime/${anime.id}`} className="group block space-y-2 h-full flex flex-col">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-secondary">
          <Image
            src={anime.poster}
            alt={anime.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="h-12 w-12 text-white/80" />
          </div>
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
              {anime.episodes?.dub && <Badge variant="default" className="bg-blue-500/80 text-white text-xs">DUB</Badge>}
              {anime.episodes?.sub && <Badge variant="secondary" className="bg-primary/80 text-primary-foreground text-xs">SUB</Badge>}
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {anime.episodes?.sub && <Badge variant="destructive" className="text-xs">{`Ep ${anime.episodes.sub}`}</Badge>}
            {anime.rating === 'R' && <Badge variant="destructive" className="bg-red-700/90 text-white text-xs">18+</Badge>}
          </div>

        </div>
        <h3 className="font-medium text-sm truncate group-hover:text-primary">{anime.name}</h3>
      </Link>
    </AnimeTooltip>
  )
}
