
'use client';
import { AnimeEpisode } from '@/lib/types/anime';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface EpisodeCardProps {
  episode: AnimeEpisode;
  animeId: string;
  isActive: boolean;
}

export default function EpisodeCard({ episode, animeId, isActive }: EpisodeCardProps) {
    const watchUrl = `/watch/${animeId}?ep=${episode.number}`;

    return (
        <Link href={watchUrl}>
            <div
                className={cn(`
                    p-3 rounded-lg text-left transition-all duration-200 group
                    `,
                    isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card/50 hover:bg-primary/20'
                    )
                }
            >
                <p className="font-semibold text-sm truncate">
                    Episode {episode.number}
                </p>
                <p className={cn(`text-xs truncate`, isActive ? 'text-primary-foreground/80' : 'text-muted-foreground group-hover:text-foreground/80')}>
                    {episode.title}
                </p>
            </div>
        </Link>
    );
}

