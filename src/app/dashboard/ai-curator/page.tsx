'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { UserHistory, AnimeBase } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { curateAnime, CuratedAnime } from '@/ai/flows/curate-anime-flow';
import { AnimeCard } from '@/components/AnimeCard';
import ErrorDisplay from '@/components/common/ErrorDisplay';

export default function AiCuratorPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [theme, setTheme] = useState('hidden gems similar to my favorites');
  const [curationResult, setCurationResult] = useState<CuratedAnime[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const historyQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'history'),
      orderBy('watchedAt', 'desc'),
      limit(25)
    );
  }, [user, firestore]);

  const { data: history, isLoading: isLoadingHistory } = useCollection<UserHistory>(historyQuery);

  const animeIds = history?.map(h => h.animeId).filter((id, index, self) => self.indexOf(id) === index) || [];

  const { data: animeDetails, isLoading: isLoadingAnimeDetails } = useQuery({
    queryKey: ['animeDetailsForCuration', animeIds],
    queryFn: async () => {
      const animeData: Record<string, AnimeBase> = {};
      const promises = animeIds.map(async (id) => {
        try {
          const data = await AnimeService.anime(id);
          if (data?.anime?.info) {
            animeData[id] = data.anime.info;
          }
        } catch (e) {
          console.warn(`Could not fetch details for anime ${id}`);
        }
      });
      await Promise.all(promises);
      return animeData;
    },
    enabled: animeIds.length > 0,
  });

  const handleCurate = async () => {
    if (!history || !animeDetails) {
      setError("Your watch history is empty. Watch some anime to get recommendations!");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setCurationResult(null);
    
    try {
      const watchedAnimes = animeIds.map(id => animeDetails[id]).filter(Boolean).map(anime => ({
        title: anime.name,
        genres: anime.moreInfo?.genres?.join(', ') || 'N/A'
      }));
      
      const result = await curateAnime({
        watchedAnimes,
        theme,
      });

      setCurationResult(result.recommendations);
    } catch (err: any) {
      console.error("Curation failed:", err);
      setError(err.message || 'An unexpected error occurred while curating your list.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDataLoading = isLoadingHistory || isLoadingAnimeDetails;

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="p-4 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">AI Curator</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                Tired of searching? Let our AI analyze your watch history and preferences to build the perfect, personalized anime playlist.
            </p>
        </div>

        <div className="bg-card/50 border border-border/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
                I'm looking for...
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., 'a short action series' or 'something to make me cry'"
                    className="flex-1 bg-background/50 h-12 text-base"
                />
                <Button 
                    size="lg"
                    onClick={handleCurate}
                    disabled={isLoading || isDataLoading}
                    className="h-12 px-8 text-base"
                >
                    {isLoading || isDataLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Curate My List
                        </>
                    )}
                </Button>
            </div>
             {isDataLoading && <p className="text-sm text-center text-muted-foreground">Loading your watch history...</p>}
        </div>

        {error && <div className="mt-8"><ErrorDisplay title="Curation Failed" description={error} isCompact /></div>}
        
        {curationResult && (
            <div className="mt-12">
                <h2 className="text-2xl font-bold font-display mb-6 text-center">Your Curated List ✨</h2>
                <div className="space-y-6">
                    {curationResult.map((anime) => (
                       <div key={anime.title} className="bg-card/50 p-4 rounded-lg border border-border/50 flex flex-col sm:flex-row gap-4 items-start">
                           <div className="sm:w-1/4">
                              <AnimeCard anime={{id: anime.animeId, name: anime.title, poster: anime.posterUrl}}/>
                           </div>
                           <div className="sm:w-3/4">
                                <h3 className="text-xl font-bold text-primary">{anime.title}</h3>
                                <p className="text-sm text-muted-foreground italic mt-2">"{anime.justification}"</p>
                           </div>
                       </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  )
}
