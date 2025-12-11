// src/components/watch2gether/W2GAnimeDetails.tsx
'use client';

import { AnimeInfo } from "@/types/anime";
import Synopsis from "../anime/Synopsis";
import { Badge } from "../ui/badge";
import { Clapperboard } from "lucide-react";
import Link from "next/link";
import ProgressiveImage from "../ProgressiveImage";

const W2GAnimeDetails = ({ animeInfo, moreInfo }: { animeInfo: AnimeInfo, moreInfo: any }) => {
    const stats = animeInfo.stats;
    return (
        <div className='p-4 md:p-6'>
             <h1 className="text-title font-bold text-glow">{animeInfo.name}</h1>
              
              <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mt-4">
                  {stats.rating && stats.rating !== 'N/A' && <Badge variant={stats.rating === 'R' ? 'destructive' : 'secondary'} className="px-2 py-1">{stats.rating}</Badge>}
                  <span className="px-2 py-1 bg-card/50 rounded-md border border-border/50">{stats.quality}</span>
                  {stats.episodes.sub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-card/50 rounded-md border border-border/50">
                          <Clapperboard className="w-3 h-3" /> SUB {stats.episodes.sub}
                      </span>
                  )}
                  {stats.episodes.dub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">
                         DUB {stats.episodes.dub}
                      </span>
                  )}
                  <span className="text-sm text-muted-foreground">&bull; {stats.type} &bull; {stats.duration}</span>
              </div>

              <div className="mt-6 max-w-3xl">
                <Synopsis description={animeInfo.description} />
              </div>
               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                 {Object.entries(moreInfo).map(([key, value]) => {
                       if (!value || (Array.isArray(value) && value.length === 0)) return null;
                       const label = key.charAt(0).toUpperCase() + key.slice(1);
                       
                       return (
                         <div key={key} className="flex justify-between border-b border-border/50 pb-2 last:border-b-0">
                            <span className="font-bold text-foreground/80">{label}:</span>
                            {key === 'genres' && Array.isArray(value) ? (
                                <div className="flex flex-wrap items-center justify-end gap-1 max-w-[60%]">
                                    {value.map((genre: string) => (
                                        <Link key={genre} href={`/search?genres=${genre.toLowerCase().replace(/ /g, '-')}`} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-md hover:text-primary hover:bg-muted">{genre}</Link>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted-foreground text-right">{Array.isArray(value) ? value.join(', ') : value}</span>
                            )}
                         </div>
                       )
                    })}
                </div>
        </div>
    )
}

export default W2GAnimeDetails;
