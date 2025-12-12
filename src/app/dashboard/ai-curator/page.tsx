
'use client';

import { useState, useMemo } from 'react';
import { AnimeBase } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/services/AnimeService';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { curateAnime, CuratedAnime } from '@/ai/flows/curate-anime-flow';
import { AnimeCard } from '@/components/AnimeCard';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { useUser, useCollection } from '@/firebase/client';
import { WatchlistItem } from '@/types/watchlist';
import toast from 'react-hot-toast';


export default function AiCuratorPage() {
  const { user } = useUser();
  const { data: watchlist, loading: loadingWatchlist } = useCollection<WatchlistItem>(`users/${user?.uid}/watchlist`);

  const [theme, setTheme] = useState('hidden gems similar to my favorites');
  const [curationResult, setCurationResult] = useState<CuratedAnime[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const animeIds = useMemo(() => {
      if (!watchlist) return [];
      return watchlist.map(item => item.id);
  }, [watchlist]);

  const { data: animeDetails, isLoading: loadingAnimeDetails } = useQuery({
      queryKey: ['watchlistDetailsForCuration', animeIds],
      queryFn: async () => {
          const promises = animeIds.map(id => AnimeService.qtip(id).catch(() => null));
          const results = await Promise.all(promises);
          return results.filter(res => res && res.anime).map(res => res.anime);
      },
      enabled: animeIds.length > 0
  });

  const handleCurate = async () => {
    if (!user) {
        toast.error("You must be logged in to use the AI Curator.");
        return;
    }
    if (!animeDetails || animeDetails.length < 3) {
        setError("You need at least 3 items in your watchlist for the curator to work effectively. Go watch some more anime!");
        return;
    }

    setIsLoading(true);
    setError(null);
    setCurationResult(null);

    const toastId = toast.loading("X-Sensei is analyzing your taste...");

    try {
        const watchedAnimes = animeDetails.map(anime => ({
            title: anime.name,
            genres: anime.genres.join(', '),
        }));

        const result = await curateAnime({ watchedAnimes, theme });
        setCurationResult(result.recommendations);
        toast.success("Your personalized list is ready!", { id: toastId });

    } catch (err: any) {
        console.error("Curation failed:", err);
        setError(err.message || "An unexpected error occurred. Please try again.");
        toast.error(err.message || "Curation failed.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };

  const isDataLoading = loadingWatchlist || loadingAnimeDetails;

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
                    disabled={isLoading || isDataLoading}
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
                            {loadingWatchlist ? 'Loading Watchlist...' : 'Curating...'}
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Curate My List
                        </>
                    )}
                </Button>
            </div>
             {!user && (
                 <p className="text-sm text-center text-muted-foreground">
                    <Link href="/login" className="text-primary hover:underline font-semibold">Log in</Link> to use the AI Curator.
                </p>
             )}
        </div>

        {error && <div className="mt-8"><ErrorDisplay title="Curation Failed" description={error} onRetry={handleCurate} isCompact /></div>}
        
        {curationResult && (
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">X-Sensei's Recommendations for You</h2>
                <div className="space-y-4">
                    {curationResult.map(rec => (
                        <div key={rec.animeId} className="bg-card/50 border border-border/50 p-4 rounded-lg flex flex-col md:flex-row gap-4">
                             <div className="w-full md:w-1/4">
                                <AnimeCard anime={{ id: rec.animeId, name: rec.title, poster: rec.posterUrl }} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-primary">{rec.title}</h3>
                                <p className="text-muted-foreground italic mt-2">"{rec.justification}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  )
}
