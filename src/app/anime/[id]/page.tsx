'use client';
import { AnimeService } from '@/lib/AnimeService';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Play, Loader2, AlertCircle, Star, Tv, Clapperboard, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimeCard } from '@/components/AnimeCard';
import { AnimeAboutResponse } from '@/types/anime';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import AnimeHero from '@/components/anime/AnimeHero';
import Synopsis from '@/components/anime/Synopsis';
import InfoSidebar from '@/components/anime/InfoSidebar';
import RelationsSidebar from '@/components/anime/RelationsSidebar';
import PVCarousel from '@/components/anime/PVCarousel';
import CharactersGrid from '@/components/anime/CharactersGrid';
import RecommendedGrid from '@/components/anime/RecommendedGrid';
import SeasonsSwiper from '@/components/anime/SeasonsSwiper';

function AnimeDetailPageContent() {
    const params = useParams();
    const animeId = params.id as string;

    const { data: aboutResponse, isLoading, error, refetch } = useQuery<{data: AnimeAboutResponse} | { success: false, error: string }>({
        queryKey: ['anime', animeId],
        queryFn: () => AnimeService.getAnimeAbout(animeId),
        enabled: !!animeId,
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>;
    }

    if (error || !aboutResponse || (aboutResponse && 'success' in aboutResponse && !aboutResponse.success) || !aboutResponse.data) {
        return (
            <ErrorDisplay 
                title="Failed to Load Anime Details"
                description="There was an error fetching the details for this anime. Please try again."
                onRetry={refetch}
            />
        );
    }
    
    const { anime, recommendedAnimes, relatedAnimes, seasons } = aboutResponse.data;
    const { info, moreInfo } = anime;

    return (
        <div>
            <AnimeHero animeInfo={info} animeId={animeId} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-9 space-y-8">
                        <Synopsis description={info.description} />
                        <SeasonsSwiper seasons={seasons} currentAnimeId={animeId} />
                        <PVCarousel videos={info.promotionalVideos} />
                        <CharactersGrid characters={info.characterVoiceActors} />
                        <RecommendedGrid recommendedAnimes={recommendedAnimes} />
                    </div>
                    <div className="lg:col-span-3 space-y-8">
                        <InfoSidebar moreInfo={moreInfo} />
                        <RelationsSidebar relatedAnimes={relatedAnimes} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AnimeDetailPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>}>
            <AnimeDetailPageContent />
        </Suspense>
    )
}
