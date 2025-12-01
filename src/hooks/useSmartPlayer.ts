
'use client';

import { useState, useEffect, useCallback } from 'react';
import * as AnimeService from '@/lib/AnimeService';
import type { Source, Subtitle } from '@/types/anime';

export function useSmartPlayer(episodeId: string, category: "sub" | "dub" = "sub") {
  const [sources, setSources] = useState<Source[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!episodeId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    
    setLoading(true);
    setError(null);

    try {
      const result = await AnimeService.sources(episodeId, "hd-1", category);
      if (!mounted) return;

      if (result.sources.length === 0) {
        setError("All streaming servers failed. Please try again later.");
      } else {
        setSources(result.sources);
        setSubtitles(result.subtitles);
      }
    } catch(e: any) {
        setError(e.message || "An unexpected error occurred.")
    } finally {
        if(mounted) setLoading(false);
    }
    
    return () => { mounted = false; };
  }, [episodeId, category]);

  useEffect(() => {
    load();
  }, [load]);

  return { sources, subtitles, loading, error, retry: load };
}
