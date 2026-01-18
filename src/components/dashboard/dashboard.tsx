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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


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


export default function DashboardHomePage() {
    const { user, userProfile, loading: isUserLoading } = useUser();
    const { data: homeData, isLoading: isLoadingHome } = useQuery<HomeData>({
        queryKey: ['homeData'],
        queryFn: AnimeService.home,
    });
    
    const { data: history, loading: isLoadingHistory } = useCollection<UserHistory>(user ? `users/${user.uid}/history` : null);
    
    const sortedHistory = useMemo(() => {
        if (!history) return [];
        return [...history].sort((a, b) => (b.watchedAt?.toMillis() || 0) - (a.watchedAt?.toMillis() || 0));
    }, [history]);
    
    const latestHistoryItem = sortedHistory?.[0];
    const latestAnimeId = latestHistoryItem?.animeId;

    const { data: latestAnimeDetails, isLoading: isLoadingLatestAnime } = useQuery<AnimeBase>({
        queryKey: ['animeDetailsForHero', latestAnimeId],
        queryFn: async () => {
             const res = await AnimeService.anime(latestAnimeId!);
             return res?.anime?.info as AnimeBase;
        },
        enabled: !!latestAnimeId
    });


    if (isUserLoading || isLoadingHome) {
        return (
             <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    const isLoadingHero = isLoadingHistory || (latestAnimeId && isLoadingLatestAnime);

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-4xl font-black font-display text-glow">
                    Welcome back, {userProfile?.displayName || 'Guest'}.
                </h1>
                <p className="text-muted-foreground mt-1">Here's what's happening in your anime world.</p>
            </header>
            
            {user && (
                isLoadingHero ? (
                     <div className="w-full h-48 bg-card/50 rounded-lg flex items-center justify-center animate-pulse">
                         <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                     </div>
                ) : latestHistoryItem && latestAnimeDetails ? (
                     <ContinueWatchingCard historyItem={latestHistoryItem} animeDetails={latestAnimeDetails} />
                ) : (
                    <div className="text-center py-10 bg-card/50 rounded-lg border border-dashed border-border/50">
                        <p className="text-muted-foreground text-sm">Your watch history is empty.</p>
                        <Link href="/home" className="text-primary font-semibold text-sm hover:underline mt-2 inline-block">Start Watching Now</Link>
                    </div>
                )
            )}
            
            {homeData?.latestEpisodeAnimes && homeData.latestEpisodeAnimes.length > 0 && (
                <Section title="New Episodes Today" icon={Flame}>
                     <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
                        <CarouselContent className="-ml-4">
                            {homeData.latestEpisodeAnimes.map((anime) => (
                                <CarouselItem key={anime.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/7 pl-4">
                                    <AnimeCard anime={anime} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-card/80 hover:bg-card hidden sm:flex" />
                        <CarouselNext className="right-2 bg-card/80 hover:bg-card hidden sm:flex" />
                    </Carousel>
                </Section>
            )}
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {homeData?.top10Animes?.week && homeData.top10Animes.week.length > 0 && (
                     <Section title="Trending This Week" icon={TrendingUp}>
                         <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
                            <CarouselContent className="-ml-4">
                                {homeData.top10Animes.week.map((anime) => (
                                    <CarouselItem key={anime.id} className="basis-1/2 md:basis-1/3 pl-4">
                                        <AnimeCard anime={anime} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 bg-card/80 hover:bg-card hidden sm:flex" />
                            <CarouselNext className="right-2 bg-card/80 hover:bg-card hidden sm:flex" />
                        </Carousel>
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
                      <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
                        <CarouselContent className="-ml-4">
                            {homeData.mostPopularAnimes.map((anime) => (
                                <CarouselItem key={anime.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/7 pl-4">
                                    <AnimeCard anime={anime} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-card/80 hover:bg-card hidden sm:flex" />
                        <CarouselNext className="right-2 bg-card/80 hover:bg-card hidden sm:flex" />
                    </Carousel>
                </Section>
            )}
        </div>
    )
}