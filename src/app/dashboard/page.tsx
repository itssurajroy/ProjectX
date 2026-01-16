'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, Activity, TrendingUp, Sparkles, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { AnimeBase, UserHistory, HomeData } from '@/lib/types/anime';
import { AnimeService } from '@/lib/services/AnimeService';
import { AnimeCard } from '@/components/AnimeCard';
import { Button } from '@/components/ui/button';
import { useUser, useCollection } from '@/firebase';
import ContinueWatchingCard from '@/components/dashboard/ContinueWatchingCard';


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

const ContinueWatchingSection = () => {
    const { user } = useUser();
    const { data: history, loading: isLoadingHistory } = useCollection<UserHistory>(`users/${user?.uid}/history`);

    const animeIds = useMemo(() => {
        if (!history || history.length === 0) return [];
        // Get the most recent unique anime IDs
        const uniqueIds = [...new Set(history.map(item => item.animeId))];
        return uniqueIds.slice(0, 6); // Limit to 6 most recent series
    }, [history]);
    
    const { data: animeDetails, isLoading: isLoadingAnime } = useQuery<Map<string, AnimeBase>>({
        queryKey: ['animeDetailsForContinueWatching', animeIds],
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
            <div className="grid-cards">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="aspect-[2/3] w-full bg-muted rounded-lg animate-pulse" />
                        <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
                    </div>
                ))}
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

    // Create a map of animeId to the latest history item for that anime
    const latestHistoryByAnime = new Map<string, UserHistory>();
    history.forEach(item => {
        if (!latestHistoryByAnime.has(item.animeId) || item.watchedAt > latestHistoryByAnime.get(item.animeId)!.watchedAt) {
            latestHistoryByAnime.set(item.animeId, item);
        }
    });
    
    return (
        <div className="grid-cards">
            {animeIds.map(animeId => {
                const details = animeDetails?.get(animeId);
                const historyItem = latestHistoryByAnime.get(animeId);
                if (!details || !historyItem) return null;
                return <ContinueWatchingCard key={historyItem.id} historyItem={historyItem} animeDetails={details} />
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
                    </section>
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
