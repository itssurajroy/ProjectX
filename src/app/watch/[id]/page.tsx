'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Share2, Bookmark, Lightbulb, Expand, SkipForward, SkipBack, Volume2, Settings, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { AnimeService } from '@/lib/AnimeService';
import AdvancedMegaPlayPlayer from '@/components/player/AdvancedMegaPlayPlayer';
import EpisodeList from '@/components/watch/episode-list';
import CommentsSection from '@/components/watch/comments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Safe episode ID extractor
const extractEpisodeNumber = (episodeId: string): string => {
  if (!episodeId) return '1';
  const match = episodeId.match(/(\d+)$/);
  // The API uses a complex ID, sometimes the number is in the middle.
  // A more robust way might be needed if format changes, but this covers the known cases.
  const secondMatch = episodeId.match(/ep=(\d+)/);
  if (secondMatch) return secondMatch[1];
  return match ? match[1] : '1';
};

function WatchPageComponent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const animeId = params.id as string;
  const episodeParam = searchParams.get('ep') || '1';

  const [about, setAbout] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');

  // Fetch anime info + episodes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [aboutRes, episodesRes] = await Promise.all([
          AnimeService.getAnimeAbout(animeId),
          AnimeService.getEpisodes(animeId)
        ]);

        if (aboutRes && 'data' in aboutRes && aboutRes.data?.anime) setAbout(aboutRes.data.anime);
        else throw new Error("Could not fetch anime details.");

        if (episodesRes && 'data' in episodesRes && episodesRes.data?.episodes) setEpisodes(episodesRes.data.episodes);
        else throw new Error("Could not fetch episode list.");

      } catch (err: any) {
        console.error('Failed to load watch page:', err);
        setError(err.message || 'Failed to load this anime. Please try again later.');
        toast.error('Failed to load anime');
      } finally {
        setLoading(false);
      }
    };

    if (animeId) fetchData();
  }, [animeId]);

  // Current episode
  const currentEpisode = useMemo(() => {
    return episodes.find(ep => extractEpisodeNumber(ep.episodeId) === episodeParam) || episodes[0];
  }, [episodes, episodeParam]);

  const currentIndex = useMemo(() => episodes.findIndex(ep => ep === currentEpisode), [episodes, currentEpisode]);
  const hasNext = currentIndex < episodes.length - 1;
  const hasPrev = currentIndex > 0;

  const navigateEpisode = (direction: 'prev' | 'next') => {
    if (!hasNext && direction === 'next') return;
    if (!hasPrev && direction === 'prev') return;

    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    const newEp = episodes[newIndex];
    if (newEp) {
      router.push(`/watch/${animeId}?ep=${extractEpisodeNumber(newEp.episodeId)}`);
    }
  };

  // Countdown to next episode
  const nextEpisodeTime = about?.moreInfo?.nextAiringEpisode?.airingTime
    ? new Date(about.moreInfo.nextAiringEpisode.airingTime * 1000)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4" />
          <p className="text-gray-400">Loading Project X Player...</p>
        </div>
      </div>
    );
  }

  if (error || !about || episodes.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Anime Not Available</h1>
          <p className="text-gray-400 mb-6">{error || "This anime is currently unavailable."}</p>
          <Link href="/home">
            <Button className="bg-destructive hover:bg-destructive/80">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Full Bleed Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={about.moreInfo?.background || about.info.poster}
          alt=""
          fill
          className="object-cover brightness-50 blur-xl scale-110"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="min-h-screen text-white pb-20 pt-16">
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          
          <div className="container mx-auto px-6 h-full flex items-end pb-10">
            <div className="flex flex-col lg:flex-row gap-10 items-end max-w-7xl">
              {/* Poster */}
              <div className="relative -mb-32 z-10 hidden lg:block">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-black">
                  <Image
                    src={about.info.poster}
                    alt={about.info.name}
                    width={350}
                    height={500}
                    className="w-[300px]"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-black leading-tight">
                  {about.info.name}
                </h1>
                {about.moreInfo.japanese && (
                  <p className="text-xl text-gray-300 italic">{about.moreInfo.japanese}</p>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-6 h-6", i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-600")} />
                    ))}
                  </div>
                  <span className="text-lg">How'd you rate this anime?</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {about.moreInfo.genres?.slice(0,5).map((g: string) => (
                    <Badge key={g} variant="destructive" className="bg-primary/20 text-primary text-base px-4 py-1.5 border border-primary/40">
                      {g}
                    </Badge>
                  ))}
                </div>

                <p className="text-base text-gray-300 max-w-3xl line-clamp-3">
                  {about.info.description?.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 mt-12 lg:-mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Player */}
            <div className="lg:col-span-8 space-y-6">
              <AdvancedMegaPlayPlayer
                iframeSrc={`https://megaplay.buzz/stream/s-2/${currentEpisode?.episodeId}`}
                title={currentEpisode?.title || `Episode ${episodeParam}`}
                episode={episodeParam}
                onNextEpisode={() => navigateEpisode('next')}
              />

              {/* Episode Title + Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    Episode {episodeParam}: {currentEpisode?.title || 'Loading...'}
                  </h2>
                  <p className="text-gray-400">
                    You are watching Episode {episodeParam} •{' '}
                    {nextEpisodeTime && (
                      <span className="text-green-400">
                        Next episode in {formatDistanceToNow(nextEpisodeTime, { addSuffix: true })}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigateEpisode('prev')}
                    disabled={!hasPrev}
                    className="border-gray-700 bg-card/50 hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1"/> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigateEpisode('next')}
                    disabled={!hasNext}
                    className="border-gray-700 bg-card/50 hover:bg-gray-800"
                  >
                    Next <ChevronRight className="w-5 h-5 ml-1"/>
                  </Button>
                </div>
              </div>

              {/* Language Toggle */}
              <div className="flex gap-3 p-4 bg-card/30 rounded-lg">
                 <p className="text-muted-foreground text-sm">NOTE: This is a placeholder UI. The video source may not change when toggling language options.</p>
                <Button
                  variant={language === 'sub' ? 'default' : 'outline'}
                  className={language === 'sub' ? 'bg-primary hover:bg-primary/80' : 'bg-transparent border-border hover:bg-muted'}
                  onClick={() => setLanguage('sub')}
                >
                  Subbed
                </Button>
                <Button
                  variant={language === 'dub' ? 'default' : 'outline'}
                  className={language === 'dub' ? 'bg-primary hover:bg-primary/80' : 'bg-transparent border-border hover:bg-muted'}
                  onClick={() => setLanguage('dub')}
                >
                  Dubbed
                </Button>
              </div>

              {/* Comments */}
              <CommentsSection animeId={animeId} episodeId={episodeParam} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <EpisodeList
                episodes={episodes}
                currentEpisodeId={episodeParam}
                onEpisodeSelect={(epId) => router.push(`/watch/${animeId}?ep=${extractEpisodeNumber(epId)}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
