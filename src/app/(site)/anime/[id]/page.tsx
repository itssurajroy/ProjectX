
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AnimeService } from '@/lib/services/AnimeService';
import AnimeHero from '@/components/anime/AnimeHero';
import EpisodeList from '@/components/anime/EpisodeList';
import RelatedCarousel from '@/components/anime/RelatedCarousel';
import CommentsContainer from '@/components/comments/CommentsContainer';
import { getSeoTemplates, applyTemplate } from '@/lib/seo';
import { SITE_NAME } from '@/lib/constants';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const animeResult = await AnimeService.anime(params.id);
    const anime = animeResult?.anime?.info;
    const templates = await getSeoTemplates();

    if (!anime) {
      return {
        title: `Anime Not Found | ${SITE_NAME}`,
      }
    }
    
    const replacements = {
        '{{anime_name}}': anime.name,
    };

    const title = applyTemplate(templates.animeTitle || 'Watch {{anime_name}} Online | {{site_name}}', replacements);
    const description = applyTemplate(templates.animeDesc || anime.description.substring(0, 160), replacements);

    return {
      title,
      description,
    }
  } catch (error) {
    console.error(`Error generating metadata for anime ${params.id}:`, error);
    return {
      title: 'Error',
      description: 'Could not load anime details.'
    }
  }
}


export default async function AnimeDetailPage({ params }: { params: { id: string } }) {
  const animeResult = await AnimeService.anime(params.id).catch(() => null);
  const episodesResult = await AnimeService.episodes(params.id).catch(() => null);

  const anime = animeResult?.anime;
  const episodes = episodesResult?.episodes || [];
  
  if (!anime?.info || !anime?.moreInfo) {
    notFound();
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <AnimeHero anime={anime.info} moreInfo={anime.moreInfo} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-12 space-y-8">
              {/* Episodes Section */}
              <EpisodeList episodes={episodes} animeId={params.id} />
              {/* Comments Section */}
              <CommentsContainer animeId={anime.info.id} animeName={anime.info.name} />
          </div>

        </div>

        {animeResult?.recommendedAnimes && animeResult.recommendedAnimes.length > 0 && (
          <div className="pt-8">
            <RelatedCarousel title="Recommendations" animes={animeResult.recommendedAnimes} />
          </div>
        )}
        
        {animeResult?.relatedAnimes && animeResult.relatedAnimes.length > 0 && (
            <div className="pt-8">
              <RelatedCarousel title="Related Anime" animes={animeResult.relatedAnimes} />
            </div>
        )}
      </main>
    </div>
  );
}
