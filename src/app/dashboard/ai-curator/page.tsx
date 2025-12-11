'use client';

import { useState } from 'react';
import { AnimeBase } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { curateAnime, CuratedAnime } from '@/ai/flows/curate-anime-flow';
import { AnimeCard } from '@/components/AnimeCard';
import ErrorDisplay from '@/components/common/ErrorDisplay';

export default function AiCuratorPage() {
  const [theme, setTheme] = useState('hidden gems similar to my favorites');
  const [curationResult, setCurationResult] = useState<CuratedAnime[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This page is now non-functional as it relied on Firebase for user data.
  // Displaying a placeholder state.

  const handleCurate = async () => {
    setError("AI Curator is temporarily disabled. Please log in to use this feature.");
  };

  const isDataLoading = false;

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
                    disabled
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
            <p className="text-sm text-center text-muted-foreground">Please log in to use the AI Curator.</p>
        </div>

        {error && <div className="mt-8"><ErrorDisplay title="Curation Failed" description={error} isCompact /></div>}
        
    </div>
  )
}
