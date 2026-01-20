'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/services/AnimeService';
import { HomeData } from '@/lib/types/anime';
import { Loader2 } from 'lucide-react';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import SpotlightCarousel from '@/components/home/SpotlightCarousel';
import TrendingCarousel from '@/components/home/TrendingCarousel';
import { AnimeSection } from '@/components/home/AnimeSection';
import AnimeColumn from '@/components/home/AnimeColumn';
import HomeSidebar from '@/components/home/HomeSidebar';
import ScheduleSection from '@/components/home/ScheduleSection';

export default function HomePage() {
  const { data: homeData, isLoading, error, refetch } = useQuery<HomeData>({
    queryKey: ['homeData'],
    queryFn: AnimeService.home,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay title="Failed to load homepage" description={error.message} onRetry={refetch} />;
  }

  if (!homeData) {
    return <ErrorDisplay title="No data available" description="Could not fetch homepage content." onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SpotlightCarousel animes={homeData.spotlightAnimes} />

      <TrendingCarousel animes={homeData.top10Animes.week} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <AnimeColumn title="Top Airing" animes={homeData.topAiringAnimes} category="top-airing" />
            <AnimeColumn title="Most Popular" animes={homeData.mostPopularAnimes} category="most-popular"/>
            <AnimeColumn title="Most Favorite" animes={homeData.mostFavoriteAnimes} category="most-favorite" />
            <AnimeColumn title="Completed" animes={homeData.latestCompletedAnimes} category="completed" />
          </div>

          <AnimeSection title="Latest Episodes" animes={homeData.latestEpisodeAnimes} category="latest-episode" />
          
          <ScheduleSection />

          <AnimeSection title="Top Upcoming" animes={homeData.topUpcomingAnimes} category="top-upcoming" />

        </div>
        <div className="lg:col-span-3">
          <HomeSidebar
            genres={homeData.genres}
            topToday={homeData.top10Animes.today}
            topWeek={homeData.top10Animes.week}
            topMonth={homeData.top10Animes.month}
          />
        </div>
      </div>
    </div>
  );
}
