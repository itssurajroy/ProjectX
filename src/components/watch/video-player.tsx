'use client';

import { useState, useEffect } from "react";
import { AnimeAbout, AnimeEpisode } from "@/types/anime";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
  anime: AnimeAbout;
  episode: AnimeEpisode | undefined;
}

export default function VideoPlayer({ anime, episode }: VideoPlayerProps) {
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    if (episode) {
      setLoading(true);
      setError(false);
      setIframeKey(Date.now()); // Reset key to force iframe reload on episode change

      // Set a timeout to show an error message if the iframe takes too long to load
      const timer = setTimeout(() => {
        if (loading) {
          setError(true);
          setLoading(false);
        }
      }, 15000); // 15 seconds timeout

      return () => clearTimeout(timer);
    }
  }, [episode, language]);

  if (!episode) {
    return (
        <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player flex items-center justify-center">
            <p className="text-muted-foreground">Select an episode to begin.</p>
        </div>
    )
  }

  const episodeNumberId = episode.episodeId.split('?ep=')[1];
  const iframeSrc = `https://megaplay.buzz/stream/s-2/${episodeNumberId}/${language}`;

  const handleReload = () => {
    setLoading(true);
    setError(false);
    setIframeKey(Date.now());
  };

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player">
        {(loading || error) && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 text-white">
                {loading && <Loader2 className="w-12 h-12 animate-spin text-primary" />}
                {error && (
                    <>
                        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                        <p className="text-lg font-semibold mb-2">Failed to load video</p>
                        <p className="text-sm text-muted-foreground mb-4">Please try reloading the player.</p>
                        <button 
                            onClick={handleReload}
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-colors"
                        >
                           <RefreshCw className="w-4 h-4" /> Reload
                        </button>
                    </>
                )}
             </div>
        )}
        <iframe
            key={iframeKey}
            src={iframeSrc}
            allowFullScreen
            onLoad={() => {
              setLoading(false);
              setError(false);
            }}
            className={cn("w-full h-full", (loading || error) && "invisible")}
            scrolling="no"
            frameBorder="0"
        ></iframe>
    </div>
  );
}
