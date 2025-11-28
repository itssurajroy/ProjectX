'use client';

import { AnimeService } from '@/lib/AnimeService';
import { HomeData } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import Spotlight from '@/components/home/Spotlight';
import HomeTabs from '@/components/home/HomeTabs';
import { Skeleton } from '@/components/ui/skeleton';

const SpotlightSkeleton = () => (
  <div className="relative w-full h-[50vh] md:h-[70vh] -mt-16">
    <Skeleton className="absolute inset-0" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
     <div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-20">
        <div className="max-w-2xl space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-3/4" />
            <div className="flex gap-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-4 mt-6">
                <Skeleton className="h-12 w-36 rounded-lg" />
                <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
        </div>
    </div>
  </div>
);


export default function HomePage() {
  const { data: homeDataResult, isLoading } = useQuery<{data: HomeData} | { success: false; error: string }>({
      queryKey: ['homeData'],
      queryFn: AnimeService.getHomeData,
  });

  const homeData = homeDataResult && !('success' in homeDataResult) ? homeDataResult.data : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isLoading || !homeData ? (
        <SpotlightSkeleton />
      ) : (
        <Spotlight animes={homeData.spotlightAnimes} />
      )}
      
      <main className="px-4 sm:px-6 lg:px-8 mt-[-6rem] md:mt-[-10rem] relative z-10 mb-12 space-y-12">
        {isLoading || !homeData ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <HomeTabs homeData={homeData} />
        )}
      </main>
    </div>
  );
}
