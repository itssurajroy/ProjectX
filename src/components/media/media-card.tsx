import type { Media } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { PlayCircle } from "lucide-react"

type MediaCardProps = {
  media: Media;
}

export default function MediaCard({ media }: MediaCardProps) {
  return (
    <Link href={`/watch/${media.id}`} className="group block space-y-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-secondary">
        <Image
          src={media.image.imageUrl}
          alt={media.title}
          fill
          data-ai-hint={media.image.imageHint}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <PlayCircle className="h-12 w-12 text-white/80" />
        </div>
        <div className="absolute top-2 left-2 flex gap-1">
            {media.type === 'DUB' && <Badge variant="default" className="bg-primary text-primary-foreground">DUB</Badge>}
            {media.type === 'SUB' && <Badge variant="secondary" className="bg-accent text-accent-foreground">SUB</Badge>}
        </div>
         <div className="absolute bottom-2 right-2">
            <Badge variant="destructive">{`Ep ${media.episodes}`}</Badge>
        </div>
      </div>
      <h3 className="font-medium text-sm truncate group-hover:text-primary">{media.title}</h3>
    </Link>
  )
}
