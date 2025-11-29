
import { AnimeBase } from "@/types/anime";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";

export default function RelatedSidebar({ relatedAnimes }: { relatedAnimes: AnimeBase[] }) {
    if (!relatedAnimes || relatedAnimes.length === 0) return null;

    return (
        <div className="bg-card/50 border border-border/50 rounded-lg p-4 space-y-4 sticky top-20">
             <h2 className="text-xl font-bold border-l-4 border-primary pl-3">Related Anime</h2>
             <div className="space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
                {relatedAnimes.map(anime => (
                    <Link href={`/anime/${anime.id}`} key={anime.id} className="flex gap-3 group p-2 rounded-md hover:bg-muted/50">
                        <div className="relative w-16 h-24 flex-shrink-0">
                            <Image 
                                src={anime.poster}
                                alt={anime.name}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{anime.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                {anime.type && <Badge variant="secondary" className="text-xs">{anime.type}</Badge>}
                                {anime.rating && <Badge variant="destructive" className="bg-amber-500/20 text-amber-300 text-xs">{anime.rating}</Badge>}
                            </div>
                        </div>
                    </Link>
                ))}
             </div>
        </div>
    );
}
