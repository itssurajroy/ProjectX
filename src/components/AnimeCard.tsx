
import { AnimeBase } from "@/types/anime"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "./ui/badge"
import { PlayCircle } from "lucide-react"
import { AnimeTooltip } from "./AnimeTooltip"

type AnimeCardProps = {
  anime: AnimeBase;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <AnimeTooltip animeId={anime.id}>
      <Link href={`/anime/${anime.id}`} className="group block space-y-2 h-full flex flex-col">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-secondary">
          <Image
            src={anime.poster}
            alt={anime.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
              <PlayCircle className="h-12 w-12 text-white/80" />
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
              {anime.episodes?.dub && <Badge variant="default" className="bg-blue-500/80 text-white">DUB</Badge>}
              {anime.episodes?.sub && <Badge variant="secondary" className="bg-primary/80 text-primary-foreground">SUB</Badge>}
          </div>
          {anime.rating === 'R' && (
              <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="bg-red-700/90 text-white">18+</Badge>
              </div>
          )}
          {anime.episodes?.sub && <div className="absolute bottom-2 right-2">
              <Badge variant="destructive">{`Ep ${anime.episodes.sub}`}</Badge>
          </div>}
        </div>
        <h3 className="font-medium text-sm truncate group-hover:text-primary">{anime.name}</h3>
      </Link>
    </AnimeTooltip>
  )
}
