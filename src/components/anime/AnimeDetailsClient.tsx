
'use client';
import { CharacterVoiceActor, AnimeInfo, AnimeAboutResponse, AnimeBase, PromotionalVideo, AnimeSeason } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { Play, Clapperboard, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimeCard } from '@/components/AnimeCard';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Synopsis from './Synopsis';
import SeasonsSwiper from './SeasonsSwiper';
import PVCarousel from './PVCarousel';
import { getMALId } from '@/lib/anime/malResolver';
import { MALService } from '@/lib/MALService';
import { Badge } from '../ui/badge';
import { getAnime, getEpisodes } from '@/lib/AnimeService';

const extractEpisodeNumber = (id: string) => id.split('?ep=')[1] || null;

const SidebarAnimeCard = ({ anime }: { anime: AnimeBase }) => (
    <Link href={`/anime/${anime.id}`} passHref>
        <div className="flex gap-4 items-center group cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="relative w-16 h-24 flex-shrink-0">
                <Image src={anime.poster} alt={anime.name} fill className="rounded-md object-cover shadow-md" />
            </div>
            <div className="overflow-hidden">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{anime.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {anime.type && <span className="flex items-center gap-1">{anime.type}</span>}
                    {anime.episodes?.sub && <span>{anime.episodes.sub} EPs</span>}
                </div>
            </div>
        </div>
    </Link>
);


const CharacterCard = ({ cv }: { cv: CharacterVoiceActor }) => (
    <div className="bg-card/50 rounded-lg overflow-hidden flex border border-border/50">
        {/* Character */}
        <div className="w-1/2 flex items-center gap-3 p-3">
            <div className="relative aspect-[2/3] w-12 flex-shrink-0">
                <Image src={cv.character.poster} alt={cv.character.name} fill className="object-cover rounded-md" />
            </div>
            <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-primary truncate">{cv.character.name}</h4>
                <p className="text-xs text-muted-foreground">{cv.character.cast}</p>
            </div>
        </div>

        {/* Voice Actor */}
        {cv.voiceActor && (
            <div className="w-1/2 flex items-center gap-3 p-3 bg-card/40 justify-end text-right">
                <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{cv.voiceActor.name}</p>
                    <p className="text-xs text-muted-foreground">{cv.voiceActor.cast}</p>
                </div>
                <div className="relative aspect-square w-12 flex-shrink-0">
                    <Image src={cv.voiceActor.poster} alt={cv.voiceActor.name} fill className="rounded-full object-cover" />
                </div>
            </div>
        )}
    </div>
);


export default function AnimeDetailsClient({ id }: { id: string }) {
  const {
    data: animeResult,
    isLoading: isLoadingAnime,
    error,
    refetch,
  } = useQuery<AnimeAboutResponse>({
    queryKey: ['anime', id],
    queryFn: () => getAnime(id),
  });
  
  const anime = animeResult?.anime;
  const animeInfo: AnimeInfo | undefined = anime?.info;
  const moreInfo = anime?.moreInfo;
  const seasons: AnimeSeason[] = animeResult?.seasons ?? [];
  const promotionalVideos: PromotionalVideo[] = animeInfo?.promotionalVideos ?? [];
  const recommendedAnimes = animeResult?.recommendedAnimes;
  const relatedAnimes = animeResult?.relatedAnimes;
  const characters: CharacterVoiceActor[] = animeInfo?.characterVoiceActors ?? [];

  const { data: malId } = useQuery({
    queryKey: ['malId', id],
    queryFn: () => getMALId(id),
    enabled: !!animeInfo,
  });

  const { data: malData } = useQuery({
    queryKey: ['mal', malId],
    queryFn: async () => {
      if (!malId) return null;
      return await MALService.getById(malId);
    },
    enabled: !!malId,
    staleTime: 60 * 60 * 1000,
  });

  const { data: episodesResult } = useQuery<any>({
    queryKey: ['episodes', id],
    queryFn: () => getEpisodes(id),
    enabled: !!animeInfo
  });

  const episodes = episodesResult?.episodes || [];
  
  const isLoading = isLoadingAnime;

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  if (error || !animeResult) return <ErrorDisplay onRetry={refetch} />;
  if (!animeInfo || !moreInfo) return <ErrorDisplay title="Anime Not Found" description="The details for this anime could not be found." />;

  
  const firstEpisode = episodes?.[0];
  const firstEpisodeWatchId = firstEpisode ? (extractEpisodeNumber(firstEpisode.episodeId) || firstEpisode.number) : null;

  const stats = animeInfo.stats;
  
  return (
    <div className="min-h-screen bg-background text-foreground">
        <div className="relative h-auto md:h-auto overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={animeInfo.poster}
              alt={animeInfo.name}
              fill
              className="object-cover opacity-10 blur-xl scale-110"
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          </div>

          <div className="px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-20 md:py-28">
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <Image
                src={animeInfo.poster}
                alt={animeInfo.name}
                width={250}
                height={380}
                className="rounded-lg shadow-2xl shadow-black/50 w-48 md:w-[250px] object-cover transition-all duration-300 hover:scale-105"
                priority
              />
            </div>
            
            <div className="lg:col-span-9 flex flex-col justify-center h-full text-center lg:text-left">
              <div className="text-sm text-muted-foreground hidden sm:block">Home &gt; {stats.type} &gt; {animeInfo.name}</div>
              <h1 className="text-3xl md:text-5xl font-bold mt-2 text-glow">{animeInfo.name}</h1>
              
              <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 text-sm text-muted-foreground mt-4">
                  {stats.rating && stats.rating !== 'N/A' && <span className="px-2 py-1 bg-card/50 rounded-md border border-border/50">⭐ {stats.rating}</span>}
                  <span className="px-2 py-1 bg-card/50 rounded-md border border-border/50">{stats.quality}</span>
                  {stats.episodes.sub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-card/50 rounded-md border border-border/50">
                          <Clapperboard className="w-3 h-3" /> SUB {stats.episodes.sub}
                      </span>
                  )}
                  {stats.episodes.dub && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">
                         DUB {stats.episodes.dub}
                      </span>
                  )}
                  <span className="text-sm text-muted-foreground">&bull; {stats.type} &bull; {stats.duration}</span>
              </div>

              <div className="mt-6 max-w-3xl mx-auto lg:mx-0">
                <Synopsis description={animeInfo.description} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
                {firstEpisodeWatchId && (
                  <Link href={`/watch/${animeInfo.id}?ep=${firstEpisodeWatchId}`} className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/20">
                    <Play /> Watch Now
                  </Link>
                )}
              </div>
              
              <p className="text-muted-foreground text-xs mt-4 max-w-3xl mx-auto lg:mx-0">
                <Link href="/" className="text-primary hover:underline">ProjectX</Link> is the best site to watch <Link href={`/anime/${animeInfo.id}`} className="text-primary hover:underline">{animeInfo.name}</Link> SUB online, or you can even watch <Link href={`/anime/${animeInfo.id}`} className="text-primary hover:underline">{animeInfo.name}</Link> DUB in HD quality. You can also find various anime on <Link href="/" className="text-primary hover:underline">ProjectX</Link> website.
              </p>
            </div>
          </div>
        </div>

      <main className="px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 bg-card/50 backdrop-blur-sm p-4 rounded-lg border border-border self-start">
                <div className="space-y-3 text-sm">
                    {Object.entries(moreInfo).map(([key, value]) => {
                       if (!value || (Array.isArray(value) && value.length === 0)) return null;
                       const label = key.charAt(0).toUpperCase() + key.slice(1);
                       
                       return (
                         <div key={key} className="flex justify-between border-b border-border/50 pb-2 last:border-b-0">
                            <span className="font-bold text-foreground/80">{label}:</span>
                            {key === 'genres' && Array.isArray(value) ? (
                                <div className="flex flex-wrap items-center justify-end gap-1 max-w-[60%]">
                                    {value.map((genre: string) => (
                                        <Link key={genre} href={`/search?genres=${genre.toLowerCase().replace(/ /g, '-')}`} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-md hover:text-primary hover:bg-muted">{genre}</Link>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted-foreground text-right">{Array.isArray(value) ? value.join(', ') : value}</span>
                            )}
                         </div>
                       )
                    })}
                </div>
            </div>

          <div className="lg:col-span-6 space-y-12">
              <SeasonsSwiper seasons={seasons} currentAnimeId={id} />

              <PVCarousel videos={promotionalVideos} />
              
              {characters.length > 0 && (
                <section>
                   <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3 flex items-center gap-2"><Users /> Characters & Voice Actors</h2>
                    <div className="grid grid-cols-1 gap-2">
                        {characters.slice(0, 10).map(cv => (
                            <CharacterCard key={cv.character.id} cv={cv} />
                        ))}
                    </div>
                </section>
              )}

             {recommendedAnimes && recommendedAnimes.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3">✨ Recommended for you</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendedAnimes?.slice(0,8).map((rec: AnimeBase) => (
                        <AnimeCard key={rec.id} anime={rec} />
                    ))}
                    </div>
                </section>
             )}

            {malData && (
              <div className="mt-12 p-4 md:p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-3xl border border-purple-800">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                  <Image src={malData.main_picture.large} width={120} height={170} className="rounded-xl shadow-2xl" alt={`MyAnimeList poster for ${malData.title}`} />
                  <div>
                    <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4">
                      MyAnimeList
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg md:text-xl px-4 py-2">
                        ★ {malData.mean || 'N/A'}
                      </Badge>
                    </h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-base md:text-lg">
                      <span className="text-purple-300 font-semibold">Rank #{malData.rank || 'N/A'}</span>
                      <span className="text-pink-300 font-semibold">{malData.num_episodes} episodes</span>
                      <span className="text-yellow-300 font-semibold">{malData.start_season?.year} {malData.start_season?.season}</span>
                    </div>
                  </div>
                </div>

                <p className="text-base text-gray-300 leading-relaxed">
                  {malData.synopsis?.replace(/\[Written by MAL Rewrite\]/g, '')}
                </p>

                {malData.recommendations?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">You Might Also Like</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {malData.recommendations.slice(0, 6).map((rec: any) => (
                        <Link key={rec.node.id} href={`/anime/mal-${rec.node.id}`}>
                          <div className="group cursor-pointer">
                            <Image src={rec.node.main_picture.medium} width={200} height={280} className="rounded-xl group-hover:scale-105 transition" alt={rec.node.title} />
                            <p className="text-center mt-2 text-sm font-medium line-clamp-2">{rec.node.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-3 space-y-6">
            {relatedAnimes && relatedAnimes.length > 0 && (
                <div className='bg-card/50 backdrop-blur-sm p-4 rounded-lg border border-border'>
                    <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">🔀 Related Anime</h2>
                    <div className="flex flex-col gap-2">
                    {relatedAnimes?.slice(0, 7).map((rec: AnimeBase) => (
                        <SidebarAnimeCard key={rec.id} anime={rec} />
                    ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
