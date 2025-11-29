
'use client';
import { useState }from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Play, Plus, Tv, Star, Clapperboard, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimeAbout } from '@/types/anime';
import InfoTable from './InfoTable';
import Balancer from 'react-wrap-balancer';

type AnimeHeroProps = {
  anime: AnimeAbout;
}

export default function AnimeHero({ anime }: AnimeHeroProps) {
    const [readMore, setReadMore] = useState(false);
    
    const { info, moreInfo } = anime;
    const stats = [
        { icon: Star, label: info.stats.rating, show: info.stats.rating },
        { icon: Tv, label: info.stats.type, show: info.stats.type },
        { icon: Clapperboard, label: `SUB ${info.stats.episodes.sub}`, show: info.stats.episodes.sub },
        { icon: Clapperboard, label: `DUB ${info.stats.episodes.dub}`, show: info.stats.episodes.dub },
        { icon: Calendar, label: moreInfo.season, show: moreInfo.season },
        { icon: Clock, label: info.stats.duration, show: info.stats.duration },
    ];

    const description = info.description.replace(/<[^>]*>/g, '');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-3">
                <div className="relative aspect-[2/3] w-full max-w-xs mx-auto md:mx-0 shadow-2xl shadow-primary/20 rounded-lg overflow-hidden border-2 border-primary/50 transform transition-transform hover:scale-105">
                    <Image 
                        src={info.poster}
                        alt={`Poster for ${info.name}`}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
            <div className="md:col-span-9 space-y-4">
                 {moreInfo.status === 'Airing' && <Badge className="bg-green-500/20 text-green-300 border-green-500/40">Currently Airing</Badge>}
                <h1 className="text-4xl lg:text-6xl font-bold text-glow font-display">
                    <Balancer>{info.name}</Balancer>
                </h1>
                {moreInfo.japanese && <p className="text-lg text-muted-foreground font-medium">{moreInfo.japanese}</p>}
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground font-medium text-sm">
                    {stats.filter(s => s.show).map(stat => (
                        <div key={stat.label} className="flex items-center gap-1.5">
                            <stat.icon className="w-4 h-4 text-primary" />
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 pt-2">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-bold shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform">
                        <Link href={`/watch/${info.id}`}>
                            <Play className="w-5 h-5 mr-2"/> Watch Now
                        </Link>
                    </Button>
                     <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 text-lg font-bold">
                        <Plus className="w-5 h-5 mr-2"/> Add to List
                    </Button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12">
            <div className="lg:col-span-9">
                 <p className={cn("text-muted-foreground text-base leading-relaxed transition-all", !readMore && "line-clamp-3")}>
                    {description}
                 </p>
                <button 
                    onClick={() => setReadMore(!readMore)}
                    className="text-primary font-semibold hover:underline mt-1"
                >
                    {readMore ? "Read Less" : "Read More"}
                </button>
            </div>
            <div className="lg:col-span-3">
                <InfoTable anime={anime} />
            </div>
        </div>
    </div>
  )
}
