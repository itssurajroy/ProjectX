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

function AnimeDetailPageContent() {
    const params = useParams();
    const animeId = params.id as string;

    const { data: aboutResponse, isLoading, error } = useQuery<{data: AnimeAboutResponse} | { success: false, error: string }>({
        queryKey: ['anime', animeId],
        queryFn: () => AnimeService.getAnimeAbout(animeId),
        enabled: !!animeId,
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>;
    }

    if (error || !aboutResponse || (aboutResponse && 'success' in aboutResponse && !aboutResponse.success) || !aboutResponse.data) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center px-4">
                <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Content Not Available</h1>
                <p className="text-muted-foreground max-w-md mt-2">
                    We couldn't load the details for this anime. It might not exist or there was a network issue.
                </p>
                <Link href="/home" className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold">
                    Back to Home
                </Link>
            </div>
        );
    }
    
    const { anime, recommendedAnimes, relatedAnimes } = aboutResponse.data;
    const { info, moreInfo } = anime;

    return (
        <div>
            {/* Hero Section */}
            <div className="relative h-[30vh] md:h-[40vh] w-full">
                <Image 
                    src={moreInfo.background || info.poster}
                    alt={`${info.name} background`}
                    fill
                    className="object-cover object-top opacity-20 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-[15vh]">
                <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column (Poster & Actions) */}
                    <div className="md:col-span-3">
                         <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-2xl shadow-primary/20 border-2 border-primary/50">
                            <Image src={info.poster} alt={info.name} fill className="object-cover" />
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <Button asChild size="lg" className="w-full">
                                <Link href={`/watch/${animeId}`}>
                                    <Play className="mr-2 h-5 w-5" /> Watch Now
                                </Link>
                            </Button>
                             <Button variant="secondary" size="lg" className="w-full">
                                <Bookmark className="mr-2 h-5 w-5" /> Add to List
                            </Button>
                        </div>
                    </div>

                    {/* Right Column (Details) */}
                    <div className="md:col-span-9">
                        <h1 className="text-3xl md:text-5xl font-bold text-glow font-display">{info.name}</h1>
                        <p className="text-muted-foreground mt-1">{moreInfo.japanese}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm mt-4">
                            {info.stats.rating && <div className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400" /> {info.stats.rating}</div>}
                            <div className="flex items-center gap-1.5"><Tv className="h-4 w-4"/> {info.stats.type}</div>
                            {info.stats.episodes.sub && <div className="flex items-center gap-1.5"><Clapperboard className="h-4 w-4"/> SUB {info.stats.episodes.sub}</div>}
                            {info.stats.episodes.dub && <div className="flex items-center gap-1.5"><Clapperboard className="h-4 w-4"/> DUB {info.stats.episodes.dub}</div>}
                            {moreInfo.aired && <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {moreInfo.aired}</div>}
                        </div>

                        <p className="mt-4 text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: info.description }} />
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                            {moreInfo.genres?.map((genre: string) => (
                                <Badge key={genre} variant="outline" className="border-primary/50 text-primary/90 bg-primary/10">{genre}</Badge>
                            ))}
                        </div>

                         <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                                {recommendedAnimes.slice(0, 10).map(rec => <AnimeCard key={rec.id} anime={rec} />)}
                            </div>
                        </div>
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
