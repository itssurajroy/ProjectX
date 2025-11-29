'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Bookmark, BookmarkCheck, Share2, Volume2, VolumeX, ChevronDown, Star, Tv, Clapperboard, Calendar, Clock, Users, Globe, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AnimeCard } from '@/components/AnimeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';

export default function AnimeDetailPage() {
  const params = useParams();
  const animeId = params.id as string;
  const [isMuted, setIsMuted] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: res, isLoading, error } = useQuery({
    queryKey: ['anime-about', animeId],
    queryFn: () => AnimeService.getAnimeAbout(animeId),
    staleTime: 1000 * 60 * 30, // 30 min cache
  });

  const anime = res?.success ? res.data.anime : null;
  const info = anime?.info;
  const moreInfo = anime?.moreInfo;
  const recommended = res?.data.recommendedAnimes || [];
  const related = res?.data.relatedAnimes || [];
  const seasons = res?.data.seasons || [];
  const pv = info?.promotionalVideos?.[0];

  useEffect(() => {
    if (pv && !isMuted) {
      const video = document.getElementById('trailer-video') as HTMLVideoElement;
      if (video) video.play().catch(() => {});
    }
  }, [isMuted, pv]);

  if (isLoading) return <AnimeDetailSkeleton />;
  if (error || !anime) return <ErrorState />;

  return (
    <>
      {/* HERO TRAILER BACKGROUND — NETFLIX STYLE */}
      <div className="relative h-screen overflow-hidden">
        {pv && (
          <video
            id="trailer-video"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4] scale-110"
            src={pv.source}
            poster={pv.thumbnail || info.poster}
            muted={isMuted}
            loop
            playsInline
          />
        )}
        {!pv && info.poster && (
          <Image
            src={info.poster}
            alt={info.name}
            fill
            className="object-cover brightness-[0.4] scale-110 blur-xl"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        {/* HERO CONTENT */}
        <div className="relative h-full flex items-end pb-32 container mx-auto px-6">
          <div className="max-w-4xl space-y-8">
            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl"
            >
              {info.name}
            </motion.h1>

            {/* Japanese Title */}
            {moreInfo.japanese && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-4xl text-gray-300 italic"
              >
                {moreInfo.japanese}
              </motion.p>
            )}

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 text-lg"
            >
              <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/50 text-lg px-4 py-2">
                <Star className="w-5 h-5 mr-1 fill-yellow-500" /> {moreInfo.malScore || "N/A"}
              </Badge>
              <span className="text-gray-300">{moreInfo.status}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{moreInfo.duration}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{info.stats.type}</span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link href={`/watch/${animeId}?ep=1`}>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-xl px-12 py-7 rounded-full font-bold shadow-2xl">
                  <Play className="w-6 h-6 mr-3 fill-current" /> Play Episode 1
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30 text-xl px-10 py-7 rounded-full font-bold"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                {isBookmarked ? <BookmarkCheck className="w-6 h-6 mr-3" /> : <Bookmark className="w-6 h-6 mr-3" />}
                {isBookmarked ? "Bookmarked" : "Add to List"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/50 text-white hover:bg-white/20 text-xl px-10 py-7 rounded-full"
                onClick={() => toast.success("Link copied!")}
              >
                <Share2 className="w-6 h-6 mr-3" /> Share
              </Button>
            </motion.div>

            {/* Synopsis */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="max-w-3xl"
            >
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed line-clamp-4">
                {info.description?.replace(/<[^>]*>/g, '')}
              </p>
              <button className="text-purple-400 font-medium mt-4 flex items-center hover:text-purple-300">
                Read More <ChevronDown className="w-5 h-5 ml-1" />
              </button>
            </motion.div>

            {/* Genres */}
            <div className="flex flex-wrap gap-3">
              {moreInfo.genres?.map((g: string) => (
                <Badge key={g} className="bg-purple-600/30 text-purple-300 border-purple-600/50 text-base px-5 py-2">
                  {g}
                </Badge>
              ))}
            </div>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-8 right-8 bg-black/50 backdrop-blur p-4 rounded-full hover:bg-black/70 transition"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* CONTENT SECTIONS — HULU STYLE */}
      <div className="bg-black text-white min-h-screen">
        <div className="container mx-auto px-6 py-16 space-y-24">
          {/* Recommended */}
          {recommended.length > 0 && (
            <section>
              <h2 className="text-4xl font-bold mb-8">Because you watched {info.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {recommended.slice(0, 12).map((rec: any) => (
                  <AnimeCard key={rec.id} anime={rec} />
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section>
              <h2 className="text-4xl font-bold mb-8">More like this</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {related.map((rel: any) => (
                  <AnimeCard key={rel.id} anime={rel} />
                ))}
              </div>
            </section>
          )}

          {/* Seasons */}
          {seasons.length > 1 && (
            <section>
              <h2 className="text-4xl font-bold mb-8">Seasons</h2>
              <div className="flex gap-6 overflow-x-auto pb-4">
                {seasons.map((season: any) => (
                  <Card key={season.id} className="bg-gray-900 border-gray-800 min-w-64">
                    <Image src={season.poster} alt={season.title} width={400} height={600} className="rounded-t-lg" />
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{season.title}</h3>
                      <p className="text-gray-400">{season.isCurrent && "Currently watching"}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

// Loading & Error States
function AnimeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <Skeleton className="h-screen w-full" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-6">
        <AlertCircle className="w-24 h-24 text-red-500 mx-auto" />
        <h1 className="text-4xl font-bold">Anime Not Found</h1>
        <p className="text-gray-400">This anime doesn't exist... yet.</p>
        <Link href="/home">
          <Button className="bg-purple-600 hover:bg-purple-700">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
