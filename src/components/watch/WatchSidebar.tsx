
'use client';
import { AnimeAbout } from "@/lib/types/anime";
import { Star } from "lucide-react";
import { Badge } from "../ui/badge";
import ProgressiveImage from "../ProgressiveImage";

interface WatchSidebarProps {
    anime: AnimeAbout;
    malData: any; // MAL data can be complex
}

const StatItem = ({ label, value }: { label: string, value: React.ReactNode }) => {
    if (!value) return null;
    return (
        <div className="text-sm">
            <span className="font-bold text-foreground/80">{label}: </span>
            <span className="text-muted-foreground">{value}</span>
        </div>
    )
}

const Rating = ({ score, reviews }: { score: number, reviews: number }) => (
    <div className="mt-4">
        <h3 className="font-bold mb-2">How'd you rate this anime?</h3>
        <div className="bg-card/80 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < Math.round(score / 2) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/50'}`} />
                ))}
            </div>
            <div className="text-right">
                <p className="font-bold text-lg">{score}/10</p>
                <p className="text-xs text-muted-foreground">{reviews.toLocaleString()} reviews</p>
            </div>
        </div>
    </div>
)


export default function WatchSidebar({ anime, malData }: WatchSidebarProps) {
    const { info, moreInfo } = anime;

    return (
        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-lg border border-border self-start sticky top-4">
             <div className="relative aspect-[2/3] w-full max-w-[200px] mx-auto rounded-md overflow-hidden shadow-lg mb-4">
                <ProgressiveImage 
                  src={info.poster}
                  alt={info.name || "Anime Poster"} 
                  fill 
                  className="object-cover"
                />
            </div>
            
            <h2 className="text-xl font-bold text-center">{info.name}</h2>
            <p className="text-xs text-muted-foreground text-center mb-3">{moreInfo.japanese}</p>

            <div className="flex items-center justify-center flex-wrap gap-2 text-sm text-muted-foreground mb-4">
                {info.stats.rating && <Badge variant="outline">{info.stats.rating}</Badge>}
                {info.stats.episodes.sub && <Badge variant="outline">CC: {info.stats.episodes.sub}</Badge>}
                {malData?.mean && <Badge variant="outline" className="gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {malData.mean}</Badge>}
                <Badge variant="outline">{info.stats.type}</Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed" dangerouslySetInnerHTML={{__html: info.description}} />
            
            <div className="space-y-1.5 text-sm mt-4 border-t border-border/50 pt-4">
                <StatItem label="Country" value={moreInfo.country} />
                <StatItem label="Genres" value={Array.isArray(moreInfo.genres) ? moreInfo.genres.join(', ') : moreInfo.genres} />
                <StatItem label="Premiered" value={moreInfo.premiered} />
                <StatItem label="Date aired" value={moreInfo.aired} />
                <StatItem label="Broadcast" value={moreInfo.broadcast} />
                <StatItem label="Episodes" value={info.stats.episodes.sub} />
                <StatItem label="Duration" value={info.stats.duration} />
                <StatItem label="Status" value={moreInfo.status} />
                {malData && <StatItem label="MAL" value={`${malData.mean} by ${malData.num_list_users?.toLocaleString()} users`} />}
            </div>

            {malData?.mean && <Rating score={malData.mean} reviews={malData.num_list_users} />}
        </div>
    )
}
