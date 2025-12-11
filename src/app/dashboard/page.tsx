
'use client';

import { AnimeBase, UserHistory, HomeData } from '@/types/anime';
import { Flame, Activity, TrendingUp, Sparkles, Users, Loader2 } from 'lucide-react';
import { AnimeCard } from '@/components/AnimeCard';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser, useCollection } from '@/firebase';
import { useMemo } from 'react';

const Section = ({ title, icon: Icon, children, href }: { title: string, icon: React.ElementType, children: React.ReactNode, href?: string }) => (
    <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                <Icon className="w-6 h-6 text-primary" />
                {title}
            </h2>
            {href && (
                <Button asChild variant="link">
                    <Link href={href}>View All</Link>
                </Button>
            )}
        </div>
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
    const { data: history, loading: isLoadingHistory } = useCollection<UserHistory>(`users/${user?.uid}/history`);

    const animeIds = useMemo(() => {
        if (!history || history.length === 0) return [];
        return [...new Set(history.map(item => item.animeId))];
    }, [history]);
    
    const { data: animeDetails, isLoading: isLoadingAnime } = useQuery<Map<string, AnimeBase>>({
        queryKey: ['animeDetails', animeIds],
        queryFn: async () => {
            const promises = animeIds.map(id => AnimeService.qtip(id).catch(() => null));
            const results = await Promise.all(promises);
            const animeMap = new Map<string, AnimeBase>();
            results.forEach(res => {
                if (res && res.anime) {
                    animeMap.set(res.anime.id, res.anime as AnimeBase);
                }
            });
            return animeMap;
        },
        enabled: animeIds.length > 0
    });

    const isLoading = isLoadingHistory || (animeIds.length > 0 && isLoadingAnime);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!history || history.length === 0) {
        return (
            <div className="text-center py-10 bg-card/50 rounded-lg border border-dashed border-border/50">
                <p className="text-muted-foreground text-sm">Your watch history is empty.</p>
                <Link href="/home" className="text-primary font-semibold text-sm hover:underline mt-2 inline-block">Start Watching Now</Link>
            </div>
        )
    }
    
    return (
        <div className="grid-cards">
            {history.slice(0, 6).map(item => {
                const details = animeDetails?.get(item.animeId);
                if (!details) return null;
                return <ContinueWatchingCard key={item.id} historyItem={item} animeDetails={details} />
            })}
        </div>
    )
};


export default function DashboardHomePage() {
     const { user, userProfile } = useUser();
     const { data: homeData, isLoading: isLoadingHome } = useQuery<HomeData>({
        queryKey: ['homeData'],
        queryFn: AnimeService.home,
    });

    if (isLoadingHome) {
        return (
             <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-4xl font-black font-display text-glow">
                    Welcome back, {userProfile?.displayName || 'Guest'}.
                </h1>
                <p className="text-muted-foreground mt-1">Here's what's happening in your anime world.</p>
            </header>
            
            {user && (
                <Section title="Continue Watching" icon={Activity} href="/dashboard/history">
                    <ContinueWatchingSection />
                </Section>
            )}
            
            {homeData?.latestEpisodeAnimes && homeData.latestEpisodeAnimes.length > 0 && (
                <Section title="New Episodes Today" icon={Flame}>
                     <div className="grid-cards">
                        {homeData.latestEpisodeAnimes.slice(0,6).map(anime => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                </Section>
            )}
            
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {homeData?.top10Animes?.week && homeData.top10Animes.week.length > 0 && (
                     <Section title="Trending This Week" icon={TrendingUp}>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {homeData.top10Animes.week.slice(0,3).map(anime => (
                                <AnimeCard key={anime.id} anime={anime} />
                            ))}
                        </div>
                    </Section>
                )}
                <Section title="Friends Activity" icon={Users} href="/dashboard/friends">
                    <div className="space-y-3 text-center py-10 bg-card/50 rounded-lg border border-dashed border-border/50">
                        <p className="text-muted-foreground text-sm">Friend activity is coming soon!</p>
                         <Button asChild variant="link">
                            <Link href="/dashboard/friends">Manage Friends</Link>
                        </Button>
                    </div>
                </Section>
            </div>

            {homeData?.mostPopularAnimes && homeData.mostPopularAnimes.length > 0 && (
                <Section title="Most Popular" icon={Sparkles}>
                     <div className="grid-cards">
                        {homeData.mostPopularAnimes.slice(0,6).map(anime => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                </Section>
            )}
        </div>
    )
}
