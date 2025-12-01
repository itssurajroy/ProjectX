
import { useState, useEffect, useCallback } from 'react';
import AnimeService from '@/lib/AnimeService';

type StreamSource = {
  url: string;
  quality?: string;
  isM3U8: boolean;
  status?: "ok" | "failed" | "loading";
};

export function useSmartPlayer(episodeId: string, category: "sub" | "dub" = "sub") {
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await AnimeService.getSmartSources(episodeId, ["hd-1", "vidstreaming", "megacloud"], category);

    if (result.sources.length === 0) {
      setError("All streaming servers failed. Please try again later.");
    } else {
      setSources(result.sources);
      setSubtitles(result.subtitles);
    }

    setLoading(false);
  }, [episodeId, category]);

  useEffect(() => {
    if (episodeId) {
      load();
    }
  }, [episodeId, load]);

  return { sources, subtitles, loading, error, retry: load };
}
