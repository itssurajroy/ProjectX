'use client';

import { useUser } from '@/firebase';
import { AnimeBase } from '@/types/anime';
import { Flame, Activity, TrendingUp, Sparkles, Users } from 'lucide-react';
import { AnimeCard } from '@/components/AnimeCard';

// Mock data until APIs are ready
const mockContinueWatching: AnimeBase[] = [
    { id: '1', name: 'Jujutsu Kaisen', poster: 'https://picsum.photos/seed/jujutsu/400/600', episodes: { sub: 24, dub: 24 } },
    { id: '2', name: 'Attack on Titan', poster: 'https://picsum.photos/seed/aot/400/600', episodes: { sub: 88, dub: 88 } },
    { id: '3', name: 'One Piece', poster: 'https://picsum.photos/seed/onepiece/400/600', episodes: { sub: 1088, dub: 1000 } },
    { id: '4', name: 'Solo Leveling', poster: 'https://picsum.photos/seed/solo/400/600', episodes: { sub: 12, dub: 12 } },
    { id: '5', name: 'Frieren: Beyond Journey\'s End', poster: 'https://picsum.photos/seed/frieren/400/600', episodes: { sub: 28, dub: 28 } },
    { id: '6', name: 'Chainsaw Man', poster: 'https://picsum.photos/seed/csm/400/600', episodes: { sub: 12, dub: 12 } },
];

const Section = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <section className="space-y-4">
        <h2 className="text-2xl font-bold font-display flex items-center gap-3">
            <Icon className="w-6 h-6 text-primary" />
            {title}
        </h2>
        {children}
    </section>
);


const ContinueWatchingCard = ({ anime }: { anime: AnimeBase }) => (
    <div className="w-full">
        <div className="relative aspect-[2/3] group">
            <AnimeCard anime={anime} />
            <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-muted/70 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.random() * 80 + 10}%` }} />
            </div>
        </div>
    </div>
);


export default function DashboardHomePage() {
    const { user } = useUser();

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-4xl font-black font-display text-glow">
                    Welcome back, {user?.displayName?.split(' ')[0] || 'Commander'}.
                </h1>
                <p className="text-muted-foreground mt-1">Here's what's happening in your anime world.</p>
            </header>
            
            <Section title="Continue Watching" icon={Activity}>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {mockContinueWatching.map(anime => (
                        <ContinueWatchingCard key={anime.id} anime={anime} />
                    ))}
                </div>
            </Section>

            <Section title="New Episodes Today" icon={Flame}>
                 <div className="grid-cards">
                    {mockContinueWatching.slice(0,6).map(anime => (
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                </div>
            </Section>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <Section title="Because You Watched One Piece" icon={Sparkles}>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mockContinueWatching.slice(3,6).map(anime => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                </Section>
                <Section title="Friends Activity" icon={Users}>
                    <div className="space-y-3">
                        <p className="text-muted-foreground text-sm">No friend activity yet. Invite some friends!</p>
                    </div>
                </Section>
            </div>
        </div>
    )
}