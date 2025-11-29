
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AnimeService } from '@/lib/AnimeService';
import { Metadata } from 'next';
import AnimeHero from '@/components/anime/AnimeHero';
import InfoTable from '@/components/anime/InfoTable';
import PVCarousel from '@/components/anime/PVCarousel';
import RelatedSidebar from '@/components/anime/RelatedSidebar';
import { AnimeSection } from '@/components/home/AnimeSection';
import { Send } from 'lucide-react';
import Link from 'next/link';
import {SITE_NAME} from '@/lib/constants'

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const animeId = params.id;
  const result = await AnimeService.getAnimeAbout(animeId);

  if (!result || 'error' in result) {
    return {
      title: 'Not Found',
      description: 'The requested anime could not be found.',
    };
  }

  const anime = result.data.anime;

  return {
    title: `${anime.info.name} - ${SITE_NAME}`,
    description: anime.info.description.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: anime.info.name,
      description: anime.info.description.replace(/<[^>]*>/g, '').substring(0, 160),
      images: [
        {
          url: anime.info.poster,
          width: 600,
          height: 900,
          alt: anime.info.name,
        },
        {
            url: anime.moreInfo.background || anime.info.poster,
            width: 1200,
            height: 630,
            alt: `Banner for ${anime.info.name}`
        }
      ],
      type: 'video.tv_show',
    },
     twitter: {
      card: 'summary_large_image',
      title: anime.info.name,
      description: anime.info.description.replace(/<[^>]*>/g, '').substring(0, 160),
      images: [anime.moreInfo.background || anime.info.poster],
    },
  };
}

export default async function AnimeDetailPage({ params }: Props) {
  const animeId = params.id;
  const result = await AnimeService.getAnimeAbout(animeId);

  if (!result || 'error' in result) {
    notFound();
  }

  const { anime, seasons, relatedAnimes, recommendedAnimes } = result.data;
  const description = anime.info.description || 'No synopsis available for this anime.';

  return (
    <div className="relative min-h-screen">
      {/* Blurred background */}
      <div className="fixed inset-0 -z-10 h-screen w-screen">
        <Image
          src={anime.moreInfo.background || anime.info.poster}
          alt={`Background for ${anime.info.name}`}
          fill
          className="object-cover object-center opacity-20 blur-lg scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background to-background" />
      </div>

      <AnimeHero anime={anime} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left/Main content */}
          <div className="lg:col-span-9 space-y-12">
            <div>
                <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3">Synopsis</h2>
                <p 
                    className="text-muted-foreground text-base leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: description }} 
                />
            </div>
            
            {anime.info.promotionalVideos && anime.info.promotionalVideos.length > 0 && (
                <PVCarousel videos={anime.info.promotionalVideos} />
            )}

            {recommendedAnimes && recommendedAnimes.length > 0 && (
                <AnimeSection title="Recommended For You" animes={recommendedAnimes} />
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-3">
            <RelatedSidebar relatedAnimes={relatedAnimes} />
          </div>
        </div>
      </main>

       {/* Floating Discord Button */}
        <a href="#" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-[#5865F2] text-white font-semibold shadow-lg transition-transform hover:scale-105">
            <Send className="w-5 h-5"/>
            <span>Join now</span>
        </a>
    </div>
  );
}
