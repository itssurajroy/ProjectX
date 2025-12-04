
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { AnimeBase, UserHistory } from '@/types/anime';
import { Flame, Activity, TrendingUp, Sparkles, Users, Loader2 } from 'lucide-react';
import { AnimeCard } from '@/components/AnimeCard';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import Link from 'next/link';

// Mock data for sections that are not yet connected to real data
const mockNewEpisodes: AnimeBase[] = [
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


const ContinueWatchingCard = ({ historyItem, animeDetails }: { historyItem: UserHistory, animeDetails: AnimeBase }) => {
    const progress = (historyItem.progress / historyItem.duration) * 100;
    const watchUrl = `/watch/${historyItem.animeId}?ep=${historyItem.episodeNumber}`;
    
    return (
        <Link href={watchUrl}>
            <div className="w-full">
                <div className="relative aspect-[2/3] group">
                    <AnimeCard anime={animeDetails} />
                    <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-muted/70 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

const ContinueWatchingSection = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const historyQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'users', user.uid, 'history'),
            orderBy('watchedAt', 'desc'),
            limit(12)
        );
    }, [user, firestore]);

    const { data: history, isLoading } = useCollection<UserHistory>(historyQuery);

    const animeIds = history?.map(h => h.animeId).filter(Boolean) || [];

    const { data: animeDetails, isLoading: isLoadingAnimeDetails } = useQuery({
        queryKey: ['animeDetails', animeIds],
        queryFn: async () => {
            const animeData: Record<string, AnimeBase> = {};
            const promises = animeIds.map(async (id) => {
                try {
                    const data = await AnimeService.anime(id);
                    if (data?.anime?.info) {
                       animeData[id] = data.anime.info;
                    }
                } catch (e) {
                    console.warn(`Could not fetch details for anime ${id}`);
                }
            });
            await Promise.all(promises);
            return animeData;
        },
        enabled: animeIds.length > 0,
    });

    if (isLoading || isLoadingAnimeDetails) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!history || history.length === 0) {
        return <p className="text-muted-foreground text-sm">You haven't watched anything yet. Start watching to see your history here!</p>;
    }
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {history.map(item => {
                const details = animeDetails?.[item.animeId];
                if (!details) return null;
                return <ContinueWatchingCard key={item.id} historyItem={item} animeDetails={details} />;
            })}
        </div>
    )
};


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
                 <ContinueWatchingSection />
            </Section>

            <Section title="New Episodes Today" icon={Flame}>
                 <div className="grid-cards">
                    {mockNewEpisodes.slice(0,6).map(anime => (
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                </div>
            </Section>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <Section title="Because You Watched One Piece" icon={Sparkles}>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mockNewEpisodes.slice(3,6).map(anime => (
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
