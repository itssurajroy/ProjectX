
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimeService } from '@/lib/AnimeService';
import type { Source, Subtitle } from '@/types/anime';

const defaultServers = ['vidstreaming', 'megacloud', 'gogocdn', 'streamwish'];

export function useSmartPlayer(
    episodeId: string, 
    category: "sub" | "dub" = "sub",
    preferredServer: string | null,
    availableServers: string[]
) {
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

    const serverPriority = [
        ...(preferredServer ? [preferredServer] : []),
        ...availableServers,
        ...defaultServers
    ].filter((v, i, a) => a.indexOf(v) === i); // Unique servers


    for (const server of serverPriority) {
        try {
            console.log(`[useSmartPlayer] Attempting to fetch from server: ${server}`);
            const result = await AnimeService.sources(episodeId, server, category);
            if (!mounted) return;

            if (result.sources && result.sources.length > 0) {
                setSources(result.sources);
                setSubtitles(result.subtitles);
                console.log(`[useSmartPlayer] Successfully loaded from server: ${server}`);
                setError(null);
                setLoading(false);
                return; // Success, exit loop
            }
        } catch (e: any) {
             console.warn(`[useSmartPlayer] Failed to fetch from server ${server}:`, e.message);
        }
    }
    
    if (mounted) {
        setError("All streaming servers failed. Please try again later or select a different server.");
        setLoading(false);
    }
    
    return () => { mounted = false; };
  }, [episodeId, category, preferredServer, availableServers]);

  useEffect(() => {
    load();
  }, [load]);

  return { sources, subtitles, loading, error, retry: load };
}
