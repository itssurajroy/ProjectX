
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimeService } from '@/lib/AnimeService';
import { Loader2, Sparkles } from 'lucide-react';
import { HomeData } from '@/types/anime';

export default function RandomAnimePage() {
  const router = useRouter();

  useEffect(() => {
    const goToRandomAnime = async () => {
      try {
        const data: HomeData = await AnimeService.home();

        const allAnime = [
          ...(data.spotlightAnimes || []),
          ...(data.trendingAnimes || []),
          ...(data.top10Animes?.today || []),
          ...(data.top10Animes?.week || []),
          ...(data.mostPopularAnimes || []),
          ...(data.latestEpisodeAnimes || []),
        ];

        if (allAnime.length === 0) throw new Error("No anime found in home data");

        // Filter for unique anime by ID
        const unique = allAnime.filter((a, i, arr) => 
          arr.findIndex(t => t.id === a.id) === i
        );

        let lastRandomId = null;
        if (typeof window !== 'undefined') {
            lastRandomId = sessionStorage.getItem('lastRandom');
        }

        let randomAnime;
        let attempts = 0;
        do {
            randomAnime = unique[Math.floor(Math.random() * unique.length)];
            attempts++;
        } while (unique.length > 1 && randomAnime.id === lastRandomId && attempts < 10)


        if (typeof window !== 'undefined') {
          sessionStorage.setItem('lastRandom', randomAnime.id);
        }

        router.push(`/anime/${randomAnime.id}`);

      } catch (err) {
        console.error("Failed to fetch random anime:", err);
        // Nuclear fallback: go to a known popular anime if API dies
        router.push('/anime/one-piece-100');
      }
    };

    goToRandomAnime();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-spin mb-4">
            <Sparkles className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Finding a Hidden Gem...</h1>
        <p className="text-muted-foreground">Teleporting you to a random anime!</p>
    </div>
  );
}
